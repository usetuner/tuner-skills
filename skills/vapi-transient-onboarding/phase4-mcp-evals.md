# Phase 4 — Connect the Tuner MCP & First Evals

> Announce: "Step 4 of 5 — setting up your first evals." (Steps 4 and 5 = connect + evaluate; the wrap-up below is step 5.)

## 4a. Connect the Tuner MCP server

1. Claude Code: `claude mcp add tuner --transport http https://api.usetuner.ai/mcp/` — or add the entry to the project's `.mcp.json` so the whole team gets it. Other agents: same URL in their MCP config.
2. Auth uses the same `TUNER_API_KEY` from Phase 2.
3. Verify by listing the Tuner tools and fetching the Custom API agent — a successful fetch is the proof. If the MCP is unavailable, fall back to the REST API (base URL + bearer key) and tell the user which mode you're in.

## 4b. Propose evals — don't ask "what's a good call?"

You already know what their agent does: you read the system prompt(s), the tools, and the configured workflows in Phase 0, and you've seen a real transcript in Phase 3. Use that.

1. Read `references/eval-starter-packs.md` and pick the vertical that matches what you observed (reception/triage, scheduling, support, orders, collections…). If nothing fits, compose from the cross-vertical evals at the top of that file.
2. Adapt the pack to *their* agent: reference their actual tool names, their actual workflows, their agent's operating language (evals must handle non-English transcripts — German, French, Arabic, Spanish — whenever the agent speaks one; write the eval prompt to expect it).
3. If their metadata (Phase 1) carries per-call configuration — prompt variants, enabled tools, workflows — scope evals to it. One eval per meaningful metadata dimension keeps context tight and makes evals adapt to each call's own configuration instead of judging every call by one global standard. This is the payoff of the metadata work.
4. **Present-then-confirm:** show the proposed evals as a compact table — name, what it checks, why it matters *for this agent* — starting with 2–4, not ten. One trusted eval beats a wall of red/green noise. Ask once: "Set these up? (yes / adjust / add)".

Eval-writing principles (apply to every prompt you create; the reference file elaborates):

- **Spirit over letter.** Instructions in the agent's prompt describe intent; evaluate the intent, not the literal wording.
- **Effort over outcome.** Connection drops, STT failures, and caller confusion aren't the agent's fault — evaluate whether the agent was handling it correctly.
- **Closed failure lists.** State exactly what counts as a failure; open-ended criteria make LLM judges either pass everything or invent failures.
- **Expect a DO-NOT-FLAG round.** After real calls flow through, some "failures" will turn out to be accepted behavior; refining exclusions is normal, not a defect.

## 4c. Run the first eval — on the real call

Create the confirmed evals via the MCP tools, then run them against the Phase 3 test call and show the scores with the evidence. A number attached to a call they just made themselves is the aha-moment.

**Cost guard:** if the user asks to evaluate historical calls, count them first. More than 100 → report the number and get explicit approval before running anything. High-volume agents log thousands of calls a day; never bulk-evaluate by default.

## 4d. Run the agent diagnosis — end with insight, not a checklist

With calls in the dashboard (especially after a backfill) and evals scored, run Tuner's **agent diagnosis** through the MCP (discover the diagnosis tool/prompt by listing the tools; the dashboard also exposes a copyable diagnosis prompt if the tool isn't available). Present the result as findings about THEIR agent:

- overall health (success rate, top failure drivers)
- the 2–3 most impactful issues found, each with a transcript example
- ONE concrete suggested change to their prompt/config — specific enough to apply

This is the closing aha-moment: they came for an integration and leave with an analysis of their agent they didn't have this morning. If they want a suggested change applied, apply it — and suggest verifying it with Tuner's simulation feature in the dashboard before rolling it out broadly.

If too few calls exist for a meaningful diagnosis (no backfill, one test call), skip this honestly — say the diagnosis becomes worthwhile after a few days of calls or a backfill, and move to the receipt.

## 4e. Wrap-up — the receipt

> Announce: "Step 5 of 5 — you're live."

End with a concrete receipt, not "all set":

- ✅ checklist: file copied verbatim · config in env vars, nothing committed · one-line wiring (serverless-safe if relevant) · metadata mapped from their per-call config · real call visible with transcript/recording/metadata · MCP connected · N evals live, first scores shown
- The one-liner of what happens from now on: **every finished Vapi call automatically appears in Tuner and gets evaluated — nothing more to do per call.**
- Dashboard link to their agent.
- What's next (pick what fits what you learned about them, one line each): alerts (latency/cost/duration/eval failures), version comparison across their prompt variants via metadata, simulated test calls from the Tuner dashboard — in the agent's own language and accents — to test prompt changes without dialing anyone, and backfill (Phase 3b) if they skipped it.

---

## Phase 4 Gate

Onboarding is complete only when at least one eval has scored at least one real call and the user has seen the result.
