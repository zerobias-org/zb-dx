---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Workspace as Isolation Boundary

Workspace is the outer container for trust, membership, audit, and execution. Everything scoped to a workspace is invisible outside it. Projects, agents, skills, members, and activity logs all carry `workspace_id`.

## Data model

```
workspace
├── id
├── name
├── settings (JSONB)
└── created_at

member (workspace_id, user_id, role)    # 'owner' | 'admin' | 'member'
agent (workspace_id, ...)
skill (workspace_id, ...)
project (workspace_id, ...)
activity_log (workspace_id, ...)
```

Every query is filtered by `workspace_id` — enforced at the middleware layer, not per-endpoint. Multica uses `RequireWorkspaceMember` middleware (`server/cmd/server/router.go:204`) to short-circuit any cross-workspace access.

## Why it works

- **Clear blast radius** — a breach or misconfiguration is contained to one workspace
- **Simple membership model** — roles exist at workspace level only; no per-project RBAC complexity
- **Audit clarity** — "show me everything that happened in this workspace" is one scan, not a recursive tree walk
- **Cheap reparenting** — move a project between workspaces = change one FK (but rarely needed)

## When to apply

- Multi-tenant apps where tenants must not see each other
- Any app with distinct trust zones (internal vs partner vs customer-facing)
- When you need a single "isolation seam" to reason about security

## Tradeoffs

- Cross-workspace operations require explicit bridges (not a silent inheritance)
- Global features (e.g., org-wide reporting) need an aggregation layer above workspace
- Users in multiple workspaces carry per-workspace identity (Multica: Member rows per workspace)

## Anti-patterns to avoid

- Don't let projects define their own isolation — kills the single-seam guarantee
- Don't scope some entities to workspace and others globally without explicit justification
- Don't skip the middleware — enforcing at the handler level leaks

## Source

Multica: `server/migrations/001_init.up.sql:30` (member roles), `server/cmd/server/router.go:204` (middleware), `server/internal/handler/*` (scoped queries throughout).
