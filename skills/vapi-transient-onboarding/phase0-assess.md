# Phase 0 — Assess (silent)

> Announce: "Step 0 of 5 — taking a look at your project first."

Do this phase almost entirely by reading the codebase. Ask nothing you can discover yourself.

## 0a. Codebase survey

Establish, in this order:

1. **Node module system.** Read `package.json`: `"type": "module"` → ESM imports; absent/commonjs → CJS (`require`). Check `engines.node` — the integration needs Node 18+ (built-in fetch). If they're on <18, flag it now, not after wiring.
2. **TypeScript or JavaScript.** `tsconfig.json` present and handlers in `.ts` → drop in the `.ts` asset as-is. Plain JS project → you will strip the type annotations when copying (the only permitted transformation, see Phase 1).
3. **Framework.** Express, Fastify, NestJS, Hono, Next.js API routes, or bare serverless functions — recognize it from dependencies and route files; don't ask.
4. **The webhook handler.** Search for where Vapi server messages arrive: `end-of-call-report`, `endedReason`, `message.type`, `serverUrl`, `server.url`, "vapi" in route paths. Teams running transient assistants almost always already consume this webhook to power their own dashboards or post-call workers — finding and reusing their existing handler is the default path. Only if none exists will Phase 1 create a minimal route.
5. **The transient assistant construction.** Find where the inline `assistant: {...}` object is built per call. Note what varies per call — customer/account/tenant id, prompt sections or variants, enabled tools, configured tasks or workflows, experiment flags. This becomes the metadata map in Phase 1. Also note `assistantOverrides.variableValues` if used.
6. **Deployment shape.** Serverless (Vercel/Netlify/Lambda/Cloud Functions — detect from `vercel.json`, `netlify.toml`, `serverless.yml`, SST/CDK config) vs long-running server. This decides the wiring style in Phase 1: fire-and-forget dies when a serverless function returns.

**Guard: confirm they're actually transient.** If call creation uses `assistantId` and there is no inline `assistant` object, stop — Tuner's native Vapi integration is simpler for them (https://docs.usetuner.ai/docs/api-and-integrations/connecting-to-vapi). Say so and ask how they'd like to proceed.

## 0b. State assessment (resume support)

Check what already exists so you never redo or re-ask:

- `send_to_tuner.ts`/`.js` already in the repo → integration copied; check whether it's wired and configured.
- `TUNER_API_KEY` (or other `TUNER_*`) already in `.env` / env config → Phase 2 partially done.
- Tuner MCP already connected (a `tuner` server in the tool list or `.mcp.json`) → Phase 4 connection step done.
- Calls possibly already flowing → if the MCP or API is available, check for existing calls on the agent before treating this as a first run.

| State | Action |
|---|---|
| Clean slate | Proceed to Phase 1 silently |
| Partially onboarded | Surface ONE concrete question naming what you found ("`send_to_tuner.ts` exists and is wired, but `TUNER_API_KEY` isn't set — continue from the keys step?") |
| Fully working already | Say so, skip to Phase 4 (evals) or ask what they want to improve |

## 0c. Report

Summarize findings to the user in 2–3 sentences — stack, where the webhook lives, what you'll attach as metadata, and where you're starting. This is a statement, not a question, unless 0b demands one.

---

## Phase 0 Gate

**Do not proceed until you know: module system, TS/JS, the wiring point (existing handler or "create one"), the per-call variables for metadata, the deployment shape, and the resume state.**

Announce: "Step 0 done." Then read [phase1-install-wire.md](phase1-install-wire.md).
