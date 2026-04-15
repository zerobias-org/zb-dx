---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Boundaries as First-Class Workspace Children

Define boundaries (security tier, audit level, data residency, PII handling, external visibility) **once at the workspace level**, then have projects reference a **subset** of those boundaries. Projects can tighten but never loosen.

## Core rule

> `project.boundaries ⊆ workspace.boundaries`

Enforced at write time by a middleware. A project that tries to reference a boundary its workspace doesn't declare is rejected.

## Data model

```
boundary
├── id
├── workspace_id
├── kind                # 'security' | 'audit' | 'residency' | 'pii' | 'visibility' | ...
├── name                # e.g. 'tier-1-security', 'us-only', 'external-buyer-visible'
├── config              # JSONB — rules specific to the kind
└── created_at

project_boundary
├── project_id
├── boundary_id         # must belong to same workspace as project
└── created_at
```

## Example

```
workspace.boundaries = {
  B1: security-tier-1,
  B2: audit-deep,
  B3: residency-US,
  B4: pii-handling,
  B5: external-party-visible
}

project_A.uses = {B1, B2, B3}              # internal, US, no PII, not external-visible
project_B.uses = {B1, B2, B3, B4}          # + handles PII
project_C.uses = {B1, B2, B3, B5}          # visible to external buyer
```

## Cross-project operations inherit the intersection

When `project_A relates_to project_C`, the relation can only carry data that honors `A.uses ∩ C.uses = {B1, B2, B3}`. Data tagged with B4 (PII) cannot flow across this edge. The schema, not a policy doc, enforces this.

## Why this matters for ZB

Brian's framing: *"the deepest requirements auditing and transparency system known to man for commerce"*. That means boundaries are:

1. **Explicit** — declared in the data, not buried in code
2. **Composable** — projects opt into subsets, not override parents
3. **Enforceable** — middleware rejects violations, activity_log records every access
4. **Auditable** — "show me everything that touched boundary B4 across all projects" is one query

## Benefits over inheritance

| Nested inheritance | First-class subset |
|--------------------|--------------------|
| Parent defines → child overrides | Parent declares set → child picks subset |
| Override semantics ambiguous | Subset is mathematically clear |
| Can loosen by accident | Cannot loosen by construction |
| Hard to audit "what rules apply here?" | Read `project_boundary` rows |

## When to apply

- Multi-party commerce where different parties see different subsets
- Regulated domains (SOC 2, HIPAA, GDPR) where residency + PII + audit levels vary per work unit
- Marketplaces where buyer/supplier visibility is asymmetric

## When simpler is fine

- Single-tenant apps with uniform security posture
- No multi-party transparency requirement

## Open questions for implementation

- How are boundaries evaluated at the activity_log level? (write every boundary set into the log entry, or reference by FK?)
- How does a project "evolve" its boundary set? (versioned boundaries? mutation with audit?)
- Do agents inherit the project's boundary set when they execute? (almost certainly yes)

## Source

Not present in Multica — this is a net-new ZB pattern inspired by Multica's clean workspace scoping. Multica stores settings in a `workspace.settings JSONB` blob (`models.go:422`) without a structured boundary model.
