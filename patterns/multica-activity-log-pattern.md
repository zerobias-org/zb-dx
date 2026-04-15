---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Append-Only Activity Log

A dedicated append-only audit table at workspace scope, capturing every meaningful state change across agents, users, and systems. Distinct from comments and domain tables — audit has its own lane.

## Data model (Multica's, with ZB extensions)

```
activity_log
├── id
├── workspace_id        # isolation boundary
├── project_id          # optional — null for workspace-level events
├── actor_type          # 'user' | 'agent' | 'system'
├── actor_id
├── action              # string enum: 'assignee_changed' | 'status_changed' | ...
├── details             # JSONB — structured metadata
├── boundary_set        # JSONB array — which boundaries were in force (ZB addition)
├── created_at
└── (NO updated_at — append-only)
```

## Why separate from domain tables

| Concern | Domain table | Activity log |
|---------|--------------|--------------|
| Mutable current state | ✓ | ✗ (append-only) |
| Queryable for "what's true now" | ✓ | derived |
| Queryable for "what happened" | ✗ | ✓ |
| Indexing strategy | Optimized for read-modify | Optimized for append + time-range scan |
| Retention policy | Business-driven | Compliance-driven (often longer) |

Mixing them creates a table that's neither good at current state nor at audit. Separate.

## Why append-only

- **Tamper evidence** — a deleted audit row is a red flag, not a normal operation
- **Replay** — reconstruct state at any past moment by folding log entries
- **Regulatory** — most compliance frameworks require immutable audit trails

Enforce with DB constraints or trigger. Don't rely on "the code won't delete."

## Action taxonomy

Keep the `action` string enum shallow but typed:
- `created` / `updated` / `deleted` / `archived` — lifecycle
- `assignee_changed` / `status_changed` / `boundary_added` / `boundary_removed` — domain events
- `agent_claimed` / `agent_started` / `agent_completed` / `agent_failed` — agent lifecycle (Multica)
- `viewed` / `exported` — read-side events (expensive but critical for transparency)

Put structured specifics in `details` JSONB. e.g. `{ "old": "todo", "new": "in_progress" }`.

## ZB extensions worth considering

- **boundary_set** — which boundaries were active when the event happened (enables "show me everything that touched PII" queries)
- **engagement_id** — roll up to the multi-party layer for cross-party transparency feeds
- **party_visible_to** — optional array of party IDs that can see this log entry (for asymmetric marketplace transparency)
- **hash_chain** — previous-entry hash in each row, gives you a Merkle-style tamper chain without blockchain overhead

## When to apply

- Any multi-party app (always)
- Regulated workflows
- Apps where "what happened?" is a user-facing feature, not just a dev/ops concern

## Tradeoffs

- Write amplification — every state change writes to two tables (domain + log)
- Storage growth — log grows forever; partition by month or workspace, archive cold data
- Query patterns differ — audit queries often run against a materialized view or a read replica

## Source

Multica: `server/migrations/001_init.up.sql:155-165` (activity_log table), `server/pkg/db/queries/activity.sql:13-26` (example: assignee_changed tracking).
