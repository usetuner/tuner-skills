# Phase 1 — Install & Wire (minimal code change)

> Announce: "Step 1 of 5 — installing the integration."

The whole footprint in their codebase should be: **one new file, one import, one function call, one metadata object.** Nothing else changes.

## 1a. Copy the integration file

Copy `assets/send_to_tuner.ts` from this skill into their project, next to the webhook handler. If the asset is missing, fetch the canonical source from the docs page (it contains the full file) and copy it verbatim.

**Permitted adaptations — boundary only, never the logic:**

- **CJS project:** convert the `export` to `module.exports` / the import site to `require`. Internal code untouched.
- **Plain JavaScript project:** strip type annotations only (types, interfaces, `as` casts, generics) to produce `send_to_tuner.js`. Every statement, constant, and comment survives.
- **Config block:** replace the four hardcoded CONFIG constants at the top with `process.env` reads (`process.env.TUNER_API_KEY` etc., keeping the non-secret defaults as fallbacks). This is required — see Phase 2.

Anything beyond these three is a rewrite, and rewrites are forbidden.

## 1b. Wire one line into the existing handler

In the `end-of-call-report` branch found in Phase 0, add:

```ts
import { sendCallToTuner } from "./send_to_tuner";
// inside the end-of-call-report branch:
sendCallToTuner(message, tunerMetadata);
```

- `message` is the `body.message` object Vapi posts — the same object their handler already destructures for their own dashboard/workers. Reuse it; don't re-parse.
- The call is fire-and-forget and never throws — do not `await` it in a long-running server; it must not delay their webhook response or their existing post-call logic.
- **Serverless (from Phase 0):** fire-and-forget dies when the function returns. Use the platform's background primitive (`waitUntil(sendCallToTuner(...))` on Vercel/Next.js) or `await` it before responding. Choose based on the detected platform; don't ask.
- **No handler exists:** create the smallest possible route — verify `body.message?.type === "end-of-call-report"`, call the function, return 200 — and note that their transient assistant config must set `server.url` to this endpoint for Vapi to deliver the report.

## 1c. Build the metadata object from their code — don't ask what to send

Metadata is what turns a stored transcript into an evaluable experiment: Tuner runs evals against it, filters by it, and compares versions across it. The rule: **whatever varies per call in how they build the transient assistant belongs in metadata.**

You already found the construction site in Phase 0. Derive the object from variables in scope in (or reachable from) the handler — typical shape:

```ts
const tunerMetadata = {
  customer_id: call.assistantOverrides?.variableValues?.customerId, // or however they thread it
  prompt_variant: cfg.promptVersion,
  enabled_tools: cfg.tools.map(t => t.name),
  workflows: cfg.tasks?.map(t => t.key),
};
```

Keep it flat-ish, JSON-serializable, and small (ids and names, not whole prompt texts). If the per-call config isn't reachable from the webhook handler (it often lives at call-creation time), the standard trick is to thread a compact id through `assistantOverrides.variableValues` at creation and look the config up in the handler — propose the smallest version of this that fits their code.

## 1d. Present ONE diff, get ONE approval

Show the user a compact summary before touching anything:

- the new file path (and which boundary adaptations applied)
- the 2–4 line handler diff
- the exact metadata object and where each field comes from
- the env vars that Phase 2 will fill

Ask once: "Apply this?" — then apply exactly what was shown. If they adjust the metadata, adjust and apply without re-asking.

---

## Phase 1 Gate

**Do not proceed until the file is in place, the handler calls it, the metadata object is wired, and the user approved the diff.**

Announce: "Step 1 done." Then read [phase2-keys.md](phase2-keys.md).
