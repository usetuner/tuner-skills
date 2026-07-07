# Assets

- `send_to_tuner.ts` — the canonical Node/TypeScript integration, identical to the code
  published at https://docs.usetuner.ai/docs/api-and-integrations/vapi-transient-assistants
  (with the placeholder CONFIG block). The skill copies this file byte-for-byte; the only
  permitted install-time adaptations are the boundary rules in phase1-install-wire.md.

Maintenance: whenever the integration file changes in the docs, update this copy in the
same release — a stale asset degrades gracefully (the skill falls back to fetching the
docs page) but bundled-and-current is the reliable path.
