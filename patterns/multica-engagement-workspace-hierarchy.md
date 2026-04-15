---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Engagement → Workspace → Projects Hierarchy

A three-tier data model that extends Multica's workspace pattern with a multi-party commerce wrapper (ZB's contribution). Workspace is the isolation boundary; Engagement is the transparency contract between parties.

## Block diagram

```
ENGAGEMENT (multi-party contract — buyer, supplier, auditor visibility)
    │
    ├── parties: [buyer_org, supplier_org, auditor_org, ...]
    ├── transparency_contract: { who sees what, audit obligations }
    │
    ▼
WORKSPACE (isolation boundary — per engagement or per scoped initiative)
    │
    ├── first-class children:
    │     • BOUNDARIES (security, audit, residency, PII, external-visible)
    │     • MEMBERS (workspace-level roles)
    │     • AGENTS (workspace-scoped)
    │     • SKILLS (reusable agent behaviors)
    │     • ACTIVITY_LOG (append-only, workspace-wide)
    │
    ▼
PROJECTS (flat siblings — graph, not tree)
    │
    └── reference SUBSET of workspace boundaries
        related via typed edges (relates_to, depends_on, blocked_by, …)
```

## Why three tiers

| Tier | Role | Lifetime |
|------|------|----------|
| Engagement | WHO is involved & WHAT transparency applies | Spans contract term (months to years) |
| Workspace | WHAT trust/audit/execution boundary is in force | Per engagement, or per scoped initiative within one |
| Project | HOW the work is organized | Weeks to months; many per workspace |

Multica has Workspace → Project. ZB adds Engagement above because multi-party commerce needs a durable "who are the parties and what did they agree to see of each other" layer that outlives any one workspace.

## Relationship rules

- An Engagement has 1..N Workspaces (e.g., one per phase, or per party-specific scope)
- A Workspace belongs to exactly one Engagement
- A Project belongs to exactly one Workspace
- All audit trails roll up: project activity → workspace activity_log → engagement-level transparency feed
- Boundary set flows engagement → workspace (contract-driven) → project (subset)

## When to apply

- Multi-party apps where parties need scoped visibility (marketplaces, audit engagements, compliance workflows)
- Any app where "the deal" outlives individual work units
- When regulators, auditors, or third parties need a stable transparency contract

## When NOT to apply

- Single-tenant internal tools — workspace alone is enough
- Apps without multi-party transparency — skip Engagement, use Workspace → Projects directly

## Related patterns

- [multica-workspace-isolation-boundary](./multica-workspace-isolation-boundary.md)
- [multica-flat-projects-with-relations](./multica-flat-projects-with-relations.md)
- [multica-boundaries-as-first-class](./multica-boundaries-as-first-class.md)
- [multica-activity-log-pattern](./multica-activity-log-pattern.md)

## Source

Multica: `server/migrations/001_init.up.sql`, `server/migrations/034_projects.up.sql`
Verified hierarchy via `workspace(id) ← project(workspace_id) ← issue(project_id, workspace_id)`.
