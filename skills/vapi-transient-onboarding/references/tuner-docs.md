# Tuner — Reference & Further Reading

Tuner ([usetuner.ai](https://usetuner.ai)) is an observability and evals platform for voice AI agents: it ingests finished calls (transcript, recording, per-turn voice metrics, tool calls), scores them with LLM-judge evals you define, and surfaces agent-health diagnoses across your call volume.

Docs are the source of truth and may be newer than this skill or any file in this repo — when in doubt, fetch the live page instead of relying on memory.

## Start here

- **Docs home:** https://docs.usetuner.ai
- **LLM-friendly full index** (every doc page, one file): https://docs.usetuner.ai/llms.txt — fetch this first when you need to find a page that isn't linked below.

## This integration

- **Vapi transient assistants** (what this skill installs): https://docs.usetuner.ai/docs/api-and-integrations/vapi-transient-assistants
- **Native Vapi integration** (simpler path if the agent uses `assistantId` instead of an inline per-call `assistant` object — no code required): https://docs.usetuner.ai/docs/api-and-integrations/connecting-to-vapi

## MCP (used in Phase 4)

- **Set up your agent via MCP** (connecting the MCP server, the `tuner_setup_agent` prompt): https://docs.usetuner.ai/docs/mcp/set-up-your-agent
- **Diagnose your agent via MCP**: https://docs.usetuner.ai/docs/mcp/diagnose-your-agent
- **Manage Tuner with MCP** (examples, best practices, use cases): https://docs.usetuner.ai/user-guide/quick-start/manage-tuner-with-mcp

## Agent configuration concepts

- **Classifying calls** — call outcomes and user intents: https://docs.usetuner.ai/docs/agent-configurations/classifying-calls-call-analysis-settings
- **Creating custom evaluations** — how eval criteria work: https://docs.usetuner.ai/docs/agent-configurations/creating-custom-evaluations-evaluation-criteria
- **Webhook proxy** (Vapi / Retell): https://docs.usetuner.ai/docs/agent-configurations/webhook-proxy

## When something looks broken

Check `references/troubleshooting.md` in this skill first — it covers the integration's own log lines. If the issue is on the Tuner side (dashboard, evals, MCP), search https://docs.usetuner.ai/llms.txt for the relevant page before guessing.
