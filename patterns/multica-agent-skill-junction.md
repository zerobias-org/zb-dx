---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Agent ↔ Skill Junction for Reusable Behaviors

Skills are named, versioned agent behaviors (deployment recipes, code review checklists, audit workflows) attached to agents via a simple many-to-many junction. At execution time, skill content is written to the agent's isolated workspace before the LLM is invoked.

## Data model (Multica's)

```
skill
├── id
├── workspace_id
├── name
├── description
├── content                  # plain text — the skill body
├── config                   # JSONB — arbitrary
├── created_by
└── created_at

skill_file
├── id
├── skill_id
├── path                     # relative path written into exec env
├── content
└── ...

agent_skill
├── agent_id
├── skill_id
└── created_at
```

## Runtime flow

1. Task is claimed by a daemon
2. Daemon fetches agent's attached skills (`agent_skill` join)
3. For each skill, write `content` + `skill_file[]` into the task's isolated execution directory
4. Invoke LLM CLI with that directory as working context
5. LLM sees skill as part of its prompt/file context

## Why this is useful

- **Compounding institutional knowledge** — a skill solves a class of problem once, then any agent can reuse it
- **Clear authorship** — `created_by` tracks provenance
- **Workspace-scoped** — skills don't leak across trust boundaries
- **Versionable** — append new versions with incremented suffixes; keep old ones for replay

## What Multica does NOT do (but ZB should)

| Feature | Multica | ZB extension |
|---------|---------|--------------|
| Semantic retrieval | ✗ | pgvector on skill.description + content |
| Skill composition | ✗ | `skill_dependency(skill_id, requires_skill_id)` |
| Skill marketplace | ✗ | Engagement-level publishing with boundary enforcement |
| Execution tracking | Partial | Link `activity_log` entries to the skills active at the time |
| Skill templates | ✗ | Parameterized skills with variable substitution |

## Pattern for ZB

```
skill                          # workspace-scoped
├── + embedding (vector)
├── + tags (array)
└── + parameters (JSONB schema)

skill_version                  # append-only
├── skill_id
├── version
├── content
└── superseded_at              # soft deprecation

skill_dependency
├── skill_id
└── requires_skill_id          # DAG enforced

agent_skill                    # same as Multica
```

## Use cases for SME Mart / Readiness Center

- Audit procedures as skills (attached to audit agents)
- RFP scoring rubrics as skills
- Vetting checklists as skills
- Compliance review templates as skills

A skill acts as an auditable, reusable unit of "how we evaluate X" that can be shared across engagements while respecting boundary constraints.

## Tradeoffs

- Plain-text content is simple but brittle — no schema for what a "good" skill looks like
- Runtime context writing adds latency and disk I/O
- Without semantic search, discovery at scale is a problem — hence the pgvector extension

## Source

Multica: `server/migrations/008_structured_skills.up.sql:4-15`, `server/internal/daemon/execenv/execenv.go:43-48` (runtime write), `server/cmd/server/router.go:306-319` (REST endpoints).
