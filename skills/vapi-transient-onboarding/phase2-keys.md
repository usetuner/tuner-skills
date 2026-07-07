# Phase 2 — Tuner Keys

> Announce: "Step 2 of 5 — connecting your Tuner account."

The one phase that genuinely needs the user's hands. Give them everything in a single message with exact click-paths — four values, all from the Tuner dashboard (https://usetuner.ai; sign up first if they have no account):

1. **TUNER_BASE_URL** — their Tuner API base URL (default `https://api.usetuner.ai`; only differs for dedicated deployments).
2. **TUNER_API_KEY** — Workspace Settings → API Keys (starts with `tr_api_`).
3. **TUNER_WORKSPACE** — Workspace → General Settings (a number).
4. **TUNER_AGENT_ID** — create a new agent with provider **Custom API**, then Agent Settings → Agent Connection → Agent ID. Suggest a recognizable name (e.g. "Vapi Production") — every transient call will appear under this one agent, which is exactly right: one dashboard for all per-call variants, sliced by metadata.

While waiting, prepare the plumbing yourself:

- Add the four variables to `.env` (placeholders until the user pastes values) and to `.env.example`.
- Verify `.env` is gitignored; fix if not.
- If they use a secrets manager or platform env config (detected in Phase 0), put the values there instead and say where.

**Security:** never hardcode the API key; never echo the full key back (first 7 chars are enough to confirm). If the user pastes the key in chat, use it, and remind them once, briefly, not to commit it anywhere.

---

## Phase 2 Gate

**Do not proceed until all four values are set in the environment the server actually runs with, and no secret is committed to the repo.**

Announce: "Step 2 done." Then read [phase3-verify.md](phase3-verify.md).
