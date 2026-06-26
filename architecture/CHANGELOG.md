# Architecture Docs Changelog

Tracks substantive changes to the handoff/architecture docs in this directory
(`transparency-architecture.md` + `.html`, the `patterns/`, `README.md`). Newest first.

**Convention:** the `.html` is generated from / kept in lockstep with the `.md` via the
visual-explainer skill (dark theme · 16px font floor · Mermaid resize+fullscreen). After
editing the `.md`, mirror the change into the `.html` and log both here so the handoff
history is clear for 3P devs and future sessions.

## 2026-06-23 — Mirrored two-org Engagement + adopt-now link-types LIVE on CI

**Model change + status sync** — authoritative source: zb/ui `.claude/docs/BACKEND_FEATURE_REQUESTS.md`
RL-001 / task-13 (project link-types **verified live on CI 2026-06-19**), SME Mart DECISIONS +
`project-link-type-vocabulary-proposal-2026-06-03-b.md` (Q-ENGAGES-ROLE resolved).

Two things the doc was stale on since the 2026-06-05 freeze:

1. **Engagement is a MIRRORED two-org model, not a single shared node.** Each org owns its OWN
   Engagement node (a `platform.Project` tagged `engagement`); the two mirrored nodes are bound by
   a typed **`engages` ↔ `engaged_by`** ResourceLink. The counterparty is held **by reference**
   (UUID↔UUID edge), not in the wipeable display name / org-tag. Direction encodes provider/customer.
   Each node still **`governs`** its own Project-rooted tree.
2. **`governs` / `engages` / `depends_on` are LIVE on CI (2026-06-19)** — registered, `project -> project`,
   verified via `linkTypeSearch`. `satisfies` / `satisfied_by` is decided on task-13 (task→task) but
   not yet in the confirmed-live CI set. Engagement *classification* ("which Projects ARE Engagements")
   is moving to a `platform.Project.type = engagement` discriminator — NOT the `engages` link.

**Files touched:** `transparency-architecture.md` (§0 thesis, §3 Engagement frame + invariant, §5
ResourceLinks adopt-now table + lateral-relations list, §14 glossary). `transparency-architecture.html`
mirrored surgically across all parallel representations (thesis prose, §3 + §5 table cells, the two
`satisfies`-PLANNED notes, the embedded md-glossary block, the `<dt><dd>` glossary, the JS-string
tooltip glossary). **Not regenerated** — interactive shell / tabs / Mermaid / scroll-spy preserved.

**Unchanged:** the transparency thesis and the §8 entangled-task-pair data seam survive intact — only
the Engagement node-count framing was corrected and the link-type status moved from PLANNED → LIVE.

## 2026-06-01 — Engagement moved off the containment axis

**Model change** — authoritative source: canonical ruling, memex
`zerobias/platform/canonical-ruling-projects-data-model-one-project-entity-three-orthogonal-axes-tier-program-engagement`.

Engagement is no longer a containment tier ("outermost boundary" / depth-0 parent with
Project as its "first child"). It is now an optional **node-role** (a `platform.Project`
tagged `engagement`) that **governs** a Project-rooted tree via a typed `governs`
ResourceLink — off the containment axis, zero data propagation. "Program" is an optional
**any-tier** node-role tag (not depth-1). Tier ladder = `project / workspace / aperture /
thread` (depth-0 = project). Brian re-blessed 2026-06-01.

**Files touched:**
- `transparency-architecture.md` — §3 Engagement primitive + the SME Mart invariant; §4.3
  hierarchy block (Brian's 2026-04-30 directive retained as labeled history); the "fixed
  ends" line; §14 glossary.
- `transparency-architecture.html` — mirrored surgically (structure/tabs/RDF/scroll-spy
  preserved): Engagement glossary cell, TAB-2 hierarchy Mermaid (EN/PR node labels +
  `EN -.->|governs| PR` replacing `EN --> PR`), and the markdown / `<dt><dd>` / JS-string
  glossary entries.
- `patterns/multica-engagement-workspace-hierarchy.md` — superseded banner.
- `patterns/multica-flat-projects-with-relations.md` — reconcile banner (ZB is a hybrid
  tree + typed-links model, not pure-flat).
- `README.md` — recorded that the `.html` is generated from the `.md`; regenerate after edits.

**Unchanged:** the transparency thesis (Engagement = the seam; nothing crosses except a
cross-engagement link or an entangled task pair) survives intact — only the containment
*representation* was corrected.
