# Tuner Skills

Agent Skills for [Tuner](https://usetuner.ai) — observability and evals for voice AI agents. Works with Claude Code, Cursor, Windsurf, Codex, and other agents supporting the [Agent Skills](https://agentskills.io) standard.

## What's included

| Skill | What it does |
| --- | --- |
| [vapi-transient-onboarding](skills/vapi-transient-onboarding) | Guided setup for Vapi **transient** (inline, call-time) assistants on Node.js: installs the drop-in integration with a one-line change to your webhook, maps your per-call configuration into metadata automatically, verifies with a real call, connects the Tuner MCP server and runs its setup flow to create evals tailored to your agent, and closes with an **agent-health diagnosis** of your real calls. Zero to evaluated calls in ~15 minutes. |

## Quick start

```bash
# Install with the skills CLI (Claude Code, Cursor, Windsurf, Codex, and more)
npx skills add usetuner/tuner-skills

# Then, inside your Vapi server project, just ask your agent:
#   "Set up Tuner for my Vapi calls"
```

### Manual install (Claude Code)

```bash
git clone https://github.com/usetuner/tuner-skills.git
# personal (all projects):
cp -r tuner-skills/skills/vapi-transient-onboarding ~/.claude/skills/
# or project-scoped (shared with your team via git):
cp -r tuner-skills/skills/vapi-transient-onboarding .claude/skills/
```

## Prerequisites

- A Tuner account — [usetuner.ai](https://usetuner.ai)
- A Node.js 18+ server receiving Vapi webhooks (the skill can create the `end-of-call-report` handler if you don't have one)

## Using `assistantId` instead of transient assistants?

Use Tuner's simpler [native Vapi integration](https://docs.usetuner.ai/docs/api-and-integrations/connecting-to-vapi) — no code required.

## Documentation

- Docs: https://docs.usetuner.ai · LLM-friendly index: https://docs.usetuner.ai/llms.txt
- This integration: https://docs.usetuner.ai/docs/api-and-integrations/vapi-transient-assistants
