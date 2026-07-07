/**
 * Backfill historical Vapi calls into Tuner
 * =========================================
 * Lists past calls from the Vapi API, reshapes each into the
 * `end-of-call-report` message format, and replays it through the same
 * `sendCallToTuner` used for live calls. Idempotent: already-sent calls
 * return 409 and are counted as "already sent" — safe to re-run.
 *
 * ADAPT BEFORE RUNNING (see phase3b-backfill.md):
 *   1. The import path to your copied send_to_tuner file.
 *   2. `metadataFor(call)` — mirror the metadata your live webhook sends.
 *
 * Usage:
 *   VAPI_API_KEY=... npx tsx backfill_from_vapi.ts --days 14 --dry-run   // count only
 *   VAPI_API_KEY=... npx tsx backfill_from_vapi.ts --days 14 --sample 5  // verify these in Tuner first!
 *   VAPI_API_KEY=... npx tsx backfill_from_vapi.ts --days 14             // full run
 */

import { sendCallToTuner } from "./send_to_tuner"; // ← ADAPT: path to your copy

const VAPI_API_KEY = process.env.VAPI_API_KEY ?? "";
const VAPI_BASE = "https://api.vapi.ai";
const PAGE_LIMIT = 100;          // Vapi max per page
const PACE_MS = 250;             // pause between sends — be gentle to both APIs

type Json = Record<string, any>;

/**
 * ADAPT: return the same metadata object your live webhook attaches
 * (Phase 1 of the onboarding). Historical calls should be first-class data.
 * Typical sources: call.assistantOverrides?.variableValues, or a lookup
 * against your own database by call.id.
 */
function metadataFor(call: Json): Json | null {
  const vars = call.assistantOverrides?.variableValues ?? {};
  const meta: Json = { backfilled: true };
  // e.g. meta.customer_id = vars.customerId;
  // e.g. meta.workflows = vars.workflows;
  return Object.keys(meta).length ? meta : null;
}

/** Reshape a GET /call object into the webhook's end-of-call-report message. */
function toWebhookMessage(call: Json): Json {
  const artifact: Json = call.artifact ?? {};
  return {
    type: "end-of-call-report",
    call,
    artifact,
    startedAt: call.startedAt,
    endedAt: call.endedAt,
    endedReason: call.endedReason,
    cost: call.cost,
    analysis: call.analysis,
    summary: call.analysis?.summary,
    transcript: artifact.transcript,
    recordingUrl: artifact.recordingUrl ?? call.recordingUrl,
    stereoRecordingUrl: artifact.stereoRecordingUrl ?? call.stereoRecordingUrl,
    messages: artifact.messages,
  };
}

async function* listCalls(sinceIso: string): AsyncGenerator<Json> {
  let createdAtLt: string | undefined;
  while (true) {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT), createdAtGt: sinceIso });
    if (createdAtLt) params.set("createdAtLt", createdAtLt);
    const res = await fetch(`${VAPI_BASE}/call?${params}`, {
      headers: { Authorization: `Bearer ${VAPI_API_KEY}` },
    });
    if (!res.ok) throw new Error(`Vapi list failed (${res.status}): ${await res.text()}`);
    const page: Json[] = await res.json();
    if (!page.length) return;
    for (const call of page) yield call;
    createdAtLt = page[page.length - 1].createdAt; // paginate backwards in time
    if (page.length < PAGE_LIMIT) return;
  }
}

async function main() {
  if (!VAPI_API_KEY) throw new Error("Set VAPI_API_KEY (your Vapi key, not the Tuner key).");
  const args = process.argv.slice(2);
  const days = Number(args[args.indexOf("--days") + 1] || 14);
  const dryRun = args.includes("--dry-run");
  const sampleIdx = args.indexOf("--sample");
  const sample = sampleIdx >= 0 ? Number(args[sampleIdx + 1] || 5) : Infinity;
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  let seen = 0, ended = 0, sentAttempts = 0;
  for await (const call of listCalls(since)) {
    seen++;
    if (call.status && call.status !== "ended") continue; // skip in-flight/queued
    ended++;
    if (dryRun) continue;
    if (sentAttempts >= sample) break;
    sentAttempts++;
    // sendCallToTuner never throws; outcomes appear in its own log lines
    // ("sent" / "already sent" / skip reasons like missing recording).
    await sendCallToTuner(toWebhookMessage(call), metadataFor(call));
    await new Promise((r) => setTimeout(r, PACE_MS));
  }

  console.log(
    dryRun
      ? `Dry run: ${seen} calls in the last ${days}d window (${ended} ended). Re-run with --sample 5 to verify a handful in Tuner first.`
      : `Attempted ${sentAttempts} of ${ended} ended calls (window: ${days}d). Check the send_to_tuner log lines above for sent / already-sent / skipped.`,
  );
}

main().catch((err) => {
  console.error("Backfill aborted:", err);
  process.exit(1);
});
