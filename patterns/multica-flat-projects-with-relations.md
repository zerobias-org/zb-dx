---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Flat Projects with Typed Relations (Graph, Not Tree)

Model projects as siblings under a workspace, connected by typed relation edges (`relates_to`, `depends_on`, `blocked_by`, `requires`, `supersedes`, `derives_from`). A DAG, not a tree.

## Why a graph beats nesting

Nesting models a tree. Real project work is a DAG:
- Project A depends on B (scheduling)
- A is also blocked by D (risk)
- A derives requirements from a charter project C

A tree can't represent "A depends on B *and* is blocked by D" without forcing one into a parent slot and losing the other. Typed relations make all dependencies first-class.

## Data model

```
project
├── id
├── workspace_id
├── name
├── status
└── ...

project_relation
├── from_project_id
├── to_project_id
├── relation_type   # enum: relates_to | depends_on | blocked_by | requires | supersedes | derives_from
└── created_at
```

## Benefits

| Capability | Nested tree | Flat + relations |
|-----------|-------------|------------------|
| "What depends on X?" | Recursive walk | Single `WHERE to_project_id = X AND relation_type = 'depends_on'` |
| Reparent | Tree mutation, risk of orphans | Edit one relation row |
| Cross-cutting dependency | Impossible without duplication | Native |
| Archive a "parent" | Orphans its children | No children to orphan |
| Match Linear/GitHub/Jira mental model | No | Yes |

## Relation type suggestions

- **relates_to** — generic weak link (default)
- **depends_on** — A can't finish until B does (scheduling)
- **blocked_by** — A can't start until B resolves (risk)
- **requires** — A consumes an output of B (data/artifact)
- **supersedes** — A replaces B (deprecation)
- **derives_from** — A was created based on B (provenance)

Keep the enum small. Add types only when a real use case demands it.

## When to apply

- Any app where work units cross-cut (SME Mart engagements, readiness assessments, multi-phase audits)
- When you need to query "what's impacted if X slips?" without recursion
- When users think in "this project relates to that one" — which is most of the time

## Tradeoffs

- Lose the implicit "parent scope" that nesting gave for free — replace with boundary references (see `multica-boundaries-as-first-class`)
- Cycles are possible in a raw graph — add a validation layer for `depends_on` / `blocked_by` (DAG invariant) while allowing `relates_to` cycles
- UI has to render a graph, not a tree — more work but better fidelity

## Source

Multica has flat projects under workspace but doesn't yet expose typed relations as a first-class entity. `project.workspace_id` is the only link; extending with a `project_relation` table is a natural ZB addition.

Multica schema: `server/migrations/034_projects.up.sql:4-19`.
