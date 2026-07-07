# Troubleshooting the Vapi → Tuner integration (Node.js)

The integration never throws — every failure produces a log line. Diagnose from the exact message.

## No log line at all
The webhook isn't firing or the branch isn't reached.
- The transient assistant config must set `server.url` (or legacy `serverUrl`) to the deployed webhook endpoint. Vapi cannot reach localhost — use ngrok/cloudflared for local testing.
- The handler must check `body.message?.type === "end-of-call-report"` and pass `body.message` (not `body`).
- **Serverless:** the platform froze the function before the fire-and-forget send ran. Use `waitUntil(sendCallToTuner(...))` (Vercel/Next.js) or `await` the send before responding.
- ESM/CJS mismatch can also fail silently at import time — check for module-resolution errors at server startup.

## "end-of-call-report has no call id"
Wrong object passed. Pass `body.message` — not the whole request body, not `body.message.call`.

## "no transcript segments found"
The call had no timed transcript rows (e.g. instantly dropped), or `artifact.messages` is missing. Verify on a call with at least one full exchange; if persistent, check the assistant's artifact settings in the transient config.

## "no recording URL, call will not be sent"
Tuner requires a recording. Enable it in the transient assistant's `artifactPlan` (`recordingEnabled: true`).

## "failed (401)" / "failed (403)"
Bad or missing API key. Confirm `TUNER_API_KEY` starts with `tr_api_`, is actually loaded (log its first 7 chars — never the full key; on serverless, env vars must be set in the platform, `.env` files often aren't loaded), and belongs to the same workspace as `TUNER_WORKSPACE`.

## "failed (404)" / "failed (400), not retryable"
Usually a wrong `TUNER_WORKSPACE` (numeric workspace id) or `TUNER_AGENT_ID` (must be a **Custom API** agent's ID from Agent Settings → Agent Connection). Also check `TUNER_WORKSPACE` isn't the string "0" default — it must be read from env as a number.

## "call already sent" (409)
Not an error — ingestion is idempotent; duplicates (e.g. Vapi webhook retries) are ignored.

## "attempt N/3 ... retrying"
Transient network/5xx/429 — built-in backoff is handling it. Investigate only if all 3 attempts fail repeatedly; then check egress rules to `TUNER_BASE_URL`.

## Call appears but metadata is missing
Metadata is sent only when passed explicitly as the second argument, must be a plain JSON-serializable object, and non-serializable metadata is dropped (with its own warning log) so the call still sends. Check that warning and the object being built — a common cause is the per-call config not being in scope in the webhook handler (thread a compact id via `assistantOverrides.variableValues` and look the config up in the handler).

## Call appears but per-turn metrics look sparse
Full metrics come from Vapi's call log (`artifact.logUrl`) — the success line says `(log-enriched)` when that path ran. Without the suffix, the log fetch failed (see its warning); the integration fell back to payload-only metrics. Calls are never lost because of it.

## Still stuck
The docs are the source of truth and may be newer than this skill:
https://docs.usetuner.ai/docs/api-and-integrations/vapi-transient-assistants
