# Phase 3b (optional) — Backfill Call History

> Offer this immediately after the Phase 3 gate passes: "Your dashboard has one call in it. Want me to backfill your recent call history from Vapi so it's full of real data before we set up evals?"

New calls now flow in automatically — but the dashboard starts empty, and an empty dashboard undersells everything that comes next. Their historical calls are still sitting in Vapi and can be replayed through the exact same integration. A backfilled dashboard means evals, intent breakdowns, latency distributions, and per-configuration comparisons light up with *their* production data on day one.

If the user declines, skip straight to Phase 4 — never push.

## 3b.1 How it works

Vapi's API can list past calls (`GET https://api.vapi.ai/call`, Bearer auth with their **Vapi** API key — a different key than Tuner's). Each returned call object carries the same `call` + `artifact` data the webhook delivers; it just needs reshaping into the `end-of-call-report` message format the integration expects. Use `scripts/backfill_from_vapi.ts` in this skill as the starting point — it does the listing, the reshaping, pacing between sends, and calls the same `sendCallToTuner` from Phase 1, so backfilled calls are processed identically to live ones (idempotent too: re-running never duplicates).

**Adapt before running, don't just execute:**

1. **Metadata parity.** Live calls get metadata from the webhook handler's scope; historical calls need the same fields or they'll be second-class data. Wire the script's `metadataFor(call)` hook the same way Phase 1 did — usually from `call.assistantOverrides.variableValues` or a lookup against their own database by call id. If parity is impossible for old calls, send what's derivable and say so.
2. **Recordings expire.** The integration skips calls without a reachable recording URL (by design — logged, not fatal). Older calls may have expired artifacts; expect the backfill yield to drop with age and tell the user that's normal, not a bug.
3. **Time window.** Default to the last 7–14 days; that's enough to make every dashboard view meaningful. Deeper history on request.

## 3b.2 Verify five before sending five thousand

Run the script in sample mode (5 calls) first. Check those five in Tuner: transcript, recording, metadata fields, timestamps in the right order. Only after the user confirms they look right, run the full window.

**Cost & volume guard:** count the window first (the script's dry-run prints it) and tell the user the number before the batch run. High-volume agents can have thousands of calls per day — never fire a full backfill on an unstated count. And keep the eval rule from SKILL.md: backfilled calls count toward the >100 evaluation confirmation too.

## 3b.3 After the batch

Report: sent / skipped (no recording) / failed, with the log lines for failures. Then point at the dashboard — this is the second aha-moment of the onboarding: their real call history, scored and sliceable, before they've changed anything about how they work.

---

## Phase 3b Gate (only if the user opted in)

The sample of 5 verified correct in Tuner, and the batch completed with a reported summary.

Continue to [phase4-mcp-evals.md](phase4-mcp-evals.md). If evals get created there, offer to run them across the backfilled window (cost guard applies).
