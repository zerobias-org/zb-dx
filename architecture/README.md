---
status: draft
author: clark
app: general
updated: 2026-05-22
---

# Architecture

Cross-cutting architecture references for developers building on the ZeroBias platform.

Distinct from neighboring categories:

| Category | Holds | Example |
|---|---|---|
| **`architecture/`** | Synthesized **multi-concept architecture overviews** — the "why" + "how it fits together" reference. Long-form, dense, evolves slowly. | this folder |
| **`patterns/`** | **Single reusable patterns** with working examples — narrow, drop-in. | `multica-engagement-workspace-hierarchy.md` |
| **`guides/`** | **Step-by-step how-tos** for a concrete task. | (future) "Your first ZB app in 30 minutes" |
| **`skills/`** | Claude/LLM skill definitions. | `/zb-dx-register` |

`patterns/` and `guides/` get *extracted from* the docs in `architecture/`. When a slice of an architecture doc is stable enough to stand alone with code, promote it to a pattern. When a slice is a procedure, promote it to a guide.

## Contents

- **[`transparency-architecture.md`](./transparency-architecture.md)** + **[`transparency-architecture.html`](./transparency-architecture.html)** — the canonical 3P-dev explanation of ZB's **transparency state machine**: Engagement / Project / Board / Task primitives, nested-Project hierarchy, the entangled `satisfies` / `satisfiedBy` Task pair, the Transparency Center (HIS ↔ Goshen ↔ ArmorStack multi-org coalition), and the OWL + SHACL + RDF + Holon / Hologram ontology overlay that culminates in the cross-org compliance-attestation container. Every construct tagged `[EXISTS]` / `[PLANNED]` / `[TBD]`. The `.html` is the interactive version (4 tabs, Mermaid, click-to-filter status, copyable RDF compass + glossary, scroll-spy TOC).

## Frontmatter convention

All `architecture/*.md` files should carry:

```yaml
---
status: draft | active | stable
author: <name>
app: general                # or the app most affected
updated: YYYY-MM-DD
---
```

## Contributing

Architecture docs are the slowest-moving artifacts in zb-dx. Big rewrites belong in a PR with explicit reviewer + Slack heads-up. Small precision corrections (a wrong API name, a fact that no longer holds, a missing status tag) can land via normal PR.

When ZB platform schema or API behavior changes in a way that invalidates a claim here, **fix it in the same PR that ships the change** — don't let architecture docs drift.
