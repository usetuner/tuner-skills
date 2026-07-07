# Phase 4 — Connect the Tuner MCP & First Evals

> Announce: "Step 4 of 5 — connecting the Tuner MCP and setting up your first evals." (Steps 4 and 5 = connect + evaluate; the wrap-up below is step 5.)

Canonical docs (source of truth, may be newer than this skill):
https://docs.usetuner.ai/docs/mcp/set-up-your-agent

## 4a. Connect the Tuner MCP server

The Tuner MCP server lives at `https://api.usetuner.ai/mcp/`. IDEs authenticate with the `TUNER_API_KEY` from Phase 2 as a Bearer token; chatbots (e.g. Claude's web/desktop app) use OAuth instead and don't need a key. Detect which agent you're running in and configure accordingly — don't ask the user which one, you already know.

**Cursor** — add to `mcp.json` (Settings → Tools & MCP → Add Custom MCP):

```json
{
  "mcpServers": {
    "tuner": {
      "type": "streamableHttp",
      "url": "https://api.usetuner.ai/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_TUNER_API_KEY"
      }
    }
  }
}
```

**Claude Code** — run, or add the equivalent to the project's `.mcp.json` so the whole team gets it:

```bash
claude mcp add tuner https://api.usetuner.ai/mcp/ --transport http --header "Authorization: Bearer YOUR_TUNER_API_KEY"
```

**Antigravity** — `...` menu → Manage MCP Servers → View raw config → add to `mcp_config.json`:

```json
{
  "mcpServers": {
    "tuner": {
      "serverUrl": "https://api.usetuner.ai/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_TUNER_API_KEY",
        "Content-Type": "application/json"
      }
    }
  }
}
```

**Other MCP-capable agents:** same URL and Bearer header pattern, adapted to that agent's MCP config format.

**Never hardcode the key in the MCP config committed to git** unless the project's own `.mcp.json` convention already expects secrets there — prefer an env-var reference if the tool supports it, and flag it to the user either way.

**Verify the connection:** list the Tuner tools and fetch the Custom API agent created in Phase 2 — a successful fetch is the proof, not just "the config looks right." If the MCP is unavailable or the handshake fails, fall back to the REST API (base URL + Bearer key from Phase 2) for the rest of this phase and tell the user which mode you're in.

## 4b. Run the setup prompt — don't hand-roll evals

Once connected, fetch and follow the **`tuner_setup_agent`** prompt from the Tuner MCP server (list prompts if you need to discover the exact name). This is Tuner's own guided flow for configuring an agent — it already knows how to walk through call outcomes, user intents, data-extraction fields, evals, red flags, and alerts; you do not need a static eval library or vertical starter pack to seed it.

What you bring to that flow that the prompt can't infer on its own:

- **What their agent actually does** — the system prompt(s), tools, and configured workflows you read in Phase 0.
- **A real transcript** — the Phase 3 verification call, so the prompt's questions get answered from evidence instead of guesses.
- **Per-call configuration** — if metadata (Phase 1) carries prompt variants, enabled tools, or workflows, mention it: evals should scope to the relevant metadata field so each call is judged against *its own* configuration, not one global standard.
- **Language.** If the agent operates in German, French, Spanish, Arabic, or any non-English language, say so explicitly — evals need to judge in that language and quote evidence from the transcript as written.

Follow the prompt's own flow for how many evals to propose and how to present them for approval; don't skip its confirmation steps.

## 4c. Run the first eval — on the real call

Once evals are created via the MCP tools, run them against the Phase 3 test call and show the scores with the evidence. A number attached to a call they just made themselves is the aha-moment.

**Cost guard:** if the user asks to evaluate historical calls (e.g. calls already in the dashboard from a native Vapi agent, or calls sent in outside this flow), count them first. More than 100 → report the number and get explicit approval before running anything. High-volume agents log thousands of calls a day; never bulk-evaluate by default.

## 4d. Run the agent diagnosis — end with insight, not a checklist

With at least one call in the dashboard and evals scored, run Tuner's **agent diagnosis** through the MCP — discover the diagnosis tool/prompt by listing what's available (see [Diagnose Your Agent](https://docs.usetuner.ai/docs/mcp/diagnose-your-agent); the dashboard also exposes a copyable diagnosis prompt if the tool isn't available). Present the result as findings about THEIR agent:

- overall health (success rate, top failure drivers)
- the 2–3 most impactful issues found, each with a transcript example
- ONE concrete suggested change to their prompt/config — specific enough to apply

This is the closing aha-moment: they came for an integration and leave with an analysis of their agent they didn't have this morning. If they want a suggested change applied, apply it — and suggest verifying it with Tuner's simulation feature in the dashboard before rolling it out broadly.

If too few calls exist for a meaningful diagnosis (just the one test call), skip this honestly — say the diagnosis becomes worthwhile after a few days of real call volume, and move to the receipt.

## 4e. Wrap-up — the receipt

> Announce: "Step 5 of 5 — you're live."

End with a concrete receipt, not "all set":

- ✅ checklist: file copied verbatim · config in env vars, nothing committed · one-line wiring (serverless-safe if relevant) · metadata mapped from their per-call config · real call visible with transcript/recording/metadata · MCP connected · N evals live, first scores shown
- The one-liner of what happens from now on: **every finished Vapi call automatically appears in Tuner and gets evaluated — nothing more to do per call.**
- Dashboard link to their agent.
- What's next (pick what fits what you learned about them, one line each): alerts (latency/cost/duration/eval failures), version comparison across their prompt variants via metadata, simulated test calls from the Tuner dashboard — in the agent's own language and accents — to test prompt changes without dialing anyone, and re-running `tuner_setup_agent` later to refine outcomes/intents/evals as the agent evolves.

---

## Phase 4 Gate

Onboarding is complete only when at least one eval has scored at least one real call and the user has seen the result.
