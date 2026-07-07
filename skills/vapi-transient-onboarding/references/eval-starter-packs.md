# Eval Starter Packs by Vertical

Recommended first evals for common voice-agent verticals. Pick the vertical matching what you observed in the user's codebase (system prompts, tools, workflows) — don't ask the user to describe their agent when their code already does.

## Cross-vertical principles (apply everywhere)

- **Ground evals in real calls.** Before finalizing any eval prompt, study at least the verification call's transcript — roles, tool-call shapes, timing. Evals written blind miss how transcripts actually look.
- **One eval per metadata dimension.** When per-call metadata carries configuration (prompt variant, enabled tools, workflows), scope evals to the relevant field rather than dumping everything into one judge. Evals should adapt to each call's own configuration.
- **Language-aware prompts.** If the agent operates in German, French, Spanish, Arabic, or any non-English language, say so explicitly in the eval prompt and instruct the judge to evaluate in that language. Quote evidence in the transcript's language.
- **Start with 2–4 evals.** Trust is built by a small set that's visibly right, then expanded.

## Cross-vertical evals (fit almost any agent)

| Eval | Checks | Why first |
|---|---|---|
| **Tool-failure honesty** | When a tool/API call errored or returned empty, did the agent acknowledge it — rather than telling the caller everything succeeded? | The most damaging silent failure in tool-using agents: "it's booked!" when the API 500'd. Closed failure list: tool result contains an error/failed status AND the agent's next turns claim success or never address it. |
| **Data extraction accuracy** | Do the captured fields (names, phone numbers, dates, structured intake data) match what the caller actually said in the transcript? | Downstream systems consume this data; wrong extraction silently corrupts records. Compare extracted values against transcript evidence, tolerating format differences (spelled-out vs numeric, date formats). |
| **Escalation & handoff correctness** | When the situation required a human (per the agent's own instructions), did the agent transfer/escalate promptly — and not escalate when it shouldn't? | Both directions matter: missed escalations are risk; needless ones erase the automation value. |
| **Instruction adherence (per-variant)** | Did the agent follow the specific instructions active on THIS call (from the metadata's prompt variant / workflow config)? | For agents configured per call, a global judge misjudges every call. Scope the eval to `metadata.<variant field>`. |

## Reception & triage agents (medical, dental, veterinary, clinics, urgent services)

Agents that answer calls for practices/clinics: booking, rescheduling and cancelling appointments, answering practice questions, taking medication or supply orders, documenting callback requests, handling referrals — and above all, recognizing emergencies. Often multilingual (e.g. German-speaking practices) and configured per clinic: different tools, opening hours, services, and triage rules per customer. That per-clinic configuration should already be flowing in as metadata — use it.

**Recommended pack (in this order):**

1. **Emergency triage correctness** — the highest-stakes eval in this vertical. The agent's prompt defines what counts as an emergency (symptom lists, severity rules) and what to do (forward immediately, on-call number, emergency service). Check both directions: every emergency-matching situation was treated as one (no missed emergencies), and routine matters weren't escalated as emergencies. Spirit over letter: a caller describing symptoms in lay terms ("he was hit by a car", "she won't stop vomiting since yesterday") must map to the triage rules even without the prompt's exact wording. If triage rules vary per customer, scope to the metadata's config so each call is judged against ITS rules. Failure list: emergency indicators present + no immediate forward/handoff; explicit distress dismissed; routine request escalated to emergency channel.
2. **Data extraction accuracy** — cross-vertical version, specialized: caller name, patient/pet name, callback number, symptom description, appointment type. Intake data feeds the practice's systems; this is usually the vertical's #1 day-to-day complaint.
3. **Tool-failure honesty** — cross-vertical version, specialized to their booking/PMS tools: never confirm an appointment or order the system didn't accept.
4. **Callback & message completeness** — when the outcome is "the team will call you back" or a message is taken, verify the documented ticket contains what the caller actually needs (who, reachable number, topic, urgency).

**Second wave (after the first pack is trusted):** empathy under distress (worried callers handled with acknowledgment before process — evaluate handling, not the caller's emotions), order-taking completeness (medication/food: item, patient, quantity, pickup vs delivery), referral-call handling, and hours/pricing answer accuracy against the configured practice data.

## Scheduling & booking agents

1. Booking confirmation integrity — every "confirmed" matched by a successful booking tool result (tool-failure honesty specialized).
2. Availability honesty — offered slots come from the availability tool, not invented.
3. Reschedule/cancel completeness — the old appointment actually released, the new one actually created.
4. Confirmation detail accuracy — date/time/location read back matches what was booked.

## Customer support agents

1. Resolution vs deflection — issues resolved or correctly escalated, not conversationally dodged.
2. Account verification adherence — required identity checks completed before account actions.
3. Tool-failure honesty (cross-vertical).
4. Missed intent — the caller's actual request was addressed, not a similar-sounding one.

## Order-taking agents (restaurants, retail, pharmacies)

1. Order accuracy — items/quantities/modifiers in the placed order match the transcript.
2. Read-back & confirmation — the full order was confirmed before submission.
3. Unavailable-item handling — out-of-stock handled with alternatives, not silently dropped.
4. Total & payment accuracy.

## Outbound agents (collections, reminders, surveys)

1. Compliance script adherence — required disclosures delivered verbatim where regulation demands it (this is the rare letter-over-spirit case).
2. Right-party verification before disclosing anything.
3. Objection & do-not-call handling.
4. Voicemail behavior — correct message, or correct silence, per policy.
