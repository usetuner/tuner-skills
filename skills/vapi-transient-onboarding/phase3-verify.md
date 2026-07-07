# Phase 3 — Verify With One Real Call

> Announce: "Step 3 of 5 — let's see a real call land in Tuner."

This is the verification gate. Prefer one real call over synthetic payloads — it exercises the whole chain (Vapi → their webhook → the integration → Tuner) and produces a call worth running the first eval on.

1. Ask the user to run the server (deployed or tunneled — Vapi webhooks can't reach localhost; suggest ngrok/cloudflared for local) and make **one short test call**. A Vapi web call is fine; no phone required. Suggest tagging it: add `{ tuner_test: true }` to the metadata for this run so it's easy to spot and filter later.
2. Watch the server logs. The integration logs every outcome:
   - `Tuner: sent call <id>` — success (`(log-enriched)` suffix means full per-turn metrics).
   - `Tuner: call <id> already sent` — idempotent duplicate, also success.
   - Anything else → read `references/troubleshooting.md` and diagnose from the exact log line. The integration never throws, so the log message is the whole story. Debug it **now** — a failure that survives this phase becomes a silent data gap in production.
3. Confirm in Tuner: if the MCP or API is available, fetch the agent's calls yourself and confirm the call is there; otherwise ask the user to open the dashboard. Verify transcript, recording, per-turn metrics, and **the metadata fields from Phase 1** are all attached.

When it lands, say so plainly — this is the moment the product becomes real: every future call now flows in with zero additional work.

---

## Phase 3 Gate

**Do not proceed until one real call is visible in Tuner with transcript, recording, and metadata attached.** "The code looks right" does not pass this gate.

Announce: "Step 3 done." Then continue to [phase4-mcp-evals.md](phase4-mcp-evals.md).
