---
name: vapi-transient-onboarding
description: Sets up Tuner for a Vapi voice agent.
compatibility: Node.js 18+ Vapi server (built-in fetch required). A Tuner account (https://usetuner.ai).
metadata:
  author: tuner
  version: "1.0.0"
  homepage: https://usetuner.ai
---

# Tuner Onboarding — Vapi Transient Assistants (Node.js)

Walk the user from zero to a **verified working loop**: one real Vapi call visible in Tuner — transcript, recording, per-turn voice metrics, tool calls, and their per-call metadata — with a first eval scored against it.

Their Vapi assistants are built **per call** (the inline `assistant` parameter), so there is no `assistantId` for Tuner's native Vapi import. Instead, one drop-in file forwards every finished call from their `end-of-call-report` webhook to a single Custom API agent in Tuner, with the per-call configuration attached as metadata so evals can adapt to it.

Canonical docs (source of truth, may be newer than this skill):
https://docs.usetuner.ai/docs/api-and-integrations/vapi-transient-assistants
Full docs index: https://docs.usetuner.ai/llms.txt

## The One Principle

**Onboarding may only end at a verified working loop — never at "code written" or "records created."** It is done when one real call is visible in the Tuner dashboard and one eval has scored it. A wrong API key, a webhook that never fires, or a serverless function that kills the send must surface *during* onboarding, not days later.

## Minimize interruptions — infer, then confirm

The user's time is the scarce resource. Read the codebase instead of asking about it: the framework, the module system, the webhook handler, what varies per call, even what the agent does — it's all in their code. The entire flow should interrupt the user only about four times:

1. Paste Tuner keys / do the dashboard clicks (Phase 2)
2. Approve one compact diff + metadata object (Phase 1)
3. Make one test call (Phase 3)
4. Walk through the Tuner MCP's setup prompt and approve the resulting evals (Phase 4)

Never ask a generic "ready to continue?". When a genuine decision is needed, ask ONE concrete question that carries the decision ("Found an existing `end-of-call-report` handler in `src/webhooks/vapi.ts` — wire Tuner in there?"). Present-then-confirm beats interrogate: show what you're about to do as a compact summary, get one yes.

## Execution Model — read this first

Execute **one phase at a time, in order**. For each phase:

1. Announce briefly: "Step N of 5 — [name]".
2. **Read the phase file** (`phaseN-*.md` in this skill directory). Do not rely on memory of its contents.
3. Complete every task in the file and satisfy its **gate condition**.
4. Announce completion in one line and continue to the next phase without waiting for the user (confirmations required inside a phase still apply).

| Phase | File | What happens | Gate |
|-------|------|--------------|------|
| 0 | [phase0-assess.md](phase0-assess.md) | Silent codebase + state survey | Wiring point and resume state known |
| 1 | [phase1-install-wire.md](phase1-install-wire.md) | Copy integration, wire one line, auto-map metadata | User approved the diff |
| 2 | [phase2-keys.md](phase2-keys.md) | Tuner account + 4 config values into env vars | Config loads, no secrets in code |
| 3 | [phase3-verify.md](phase3-verify.md) | One real call, end to end | Call visible in Tuner dashboard |
| 4 | [phase4-mcp-evals.md](phase4-mcp-evals.md) | Connect Tuner MCP, run its setup prompt for evals, agent diagnosis | One eval scored a real call |

**Speak the user's language.** If the user writes in German (or any other language), run the whole onboarding in it — announcements, confirmations, the receipt. The phase files are instructions to you, not scripts to recite.

## Hard rules

- **Never regenerate the integration file.** Copy `assets/send_to_tuner.ts` byte-for-byte (adaptation rules in Phase 1). It encodes retry, idempotency, and Vapi log-format handling that a rewrite silently breaks.
- **Never invent IDs or keys.** Every workspace id, agent id, and API key comes from the user or a real tool response. If you don't have it, ask or call the tool — never guess.
- **Prefer tools over descriptions.** When the Tuner MCP is connected, actually call the tool; never claim a step is done until the call succeeds. Fall back to the REST API (bearer key from Phase 2) only when the MCP is unavailable.
- **Respect their code.** One import, one call, one metadata object. Never restructure their webhook handler, rename their files, or "clean up" surrounding code.
- **Cost guard.** Never trigger evaluation of more than 100 historical calls without telling the user the count and getting explicit approval — evals cost real money, and production agents can log thousands of calls per day.

## Reference files

- `references/troubleshooting.md` — diagnose from the integration's log lines; read when Phase 3 fails.
- `references/tuner-docs.md` — links to the Tuner docs (MCP, evals, diagnosis, Vapi integrations) for anything not covered in this skill.
- `assets/` — the canonical integration file(s) to copy.

