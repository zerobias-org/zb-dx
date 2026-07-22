# Architecture Docs Changelog

Tracks substantive changes to the handoff/architecture docs in this directory
(`transparency-architecture.md` + `.html`, the `patterns/`, `README.md`). Newest first.

**Convention:** the `.html` is generated from / kept in lockstep with the `.md` via the
visual-explainer skill (dark theme · 16px font floor · Mermaid resize+fullscreen). After
editing the `.md`, mirror the change into the `.html` and log both here so the handoff
history is clear for 3P devs and future sessions.

## 2026-07-21 — Correction: `satisfied_by` (snake_case) and it is DELIVERED, not planned

**Two factual errors corrected in `transparency-architecture.md` (+ `README.md`).** Both were
prod-verified 2026-07-20 before changing the docs.

1. **Spelling — the reverse predicate is `satisfied_by`, not `satisfiedBy`.** The doc used the
   camelCase form in the §8 heading and prose, §5.2, the ASCII boundary diagram, the open-items
   list, and the glossary line about paired types — while the §5.2 link-type *table* and the
   glossary entry already had `satisfied_by` correct. So the doc contradicted itself and the
   wrong form was the more prominent one. Link-type predicates render via the UI `snakeToSpaces`
   pipe, so snake_case is the house convention (`engaged_by`, `governed_by`, `dependency_of`) —
   already documented in `SYNC-RECIPE.md`.

2. **Status — `[PLANNED]` → `[EXISTS]`.** §8 said "these link types are proposed, not yet in the
   link-type registry. Verify before use," and the `[TBD] / open` list carried "Need Nic to
   register them (per env)" as item 3. Both are stale. Live on prod:
   `tasksatisfiestask`, id `182d7fd6-6f3e-11f1-866f-7f0be032d30e`, `task -> task`,
   `multi: true`, `inherit: false` — same id batch as `governs` (`182d7b8a-…`), so it shipped in
   the ~2026-06-19 wave with the other RL-001 types. Item 3 removed from the open list (remaining
   items renumbered 3–7) with a resolved-note pointing at §8.

**Why it mattered:** a 3P dev reading this doc would have coded `satisfiedBy` against a predicate
that does not exist, and would have treated a shipped capability as unavailable. Verified against
prod via `linkTypeSearch` rather than from the doc's own claims.

**Not touched:** `boundary-project-mocks/fixtures/cmmc-instances.json` also contains `satisfiedBy`,
but that is a **mock fixture field name** (which boundary satisfies a thread leaf) — unrelated to
the ResourceLink predicate. Left as-is deliberately.

**✅ `.html` MIRRORED 2026-07-21** (was outstanding — see the note that previously stood here).
Seven surgical edits, no regeneration: the four `satisfiedBy` → `satisfied_by` occurrences (the
TAB-3 Mermaid entangled-pair edge label, the multi-party `mm-cap`, the ResourceLink glossary
`<dd>`, and the JS glossary object key — the key was renamed so the click-to-define lookup still
resolves); the §8 "Naming change" note reworded from "the current proposal is" to delivered, with
the prod-verified id; and the open-items bullet flipped `chip planned` → `chip exists` with a
RESOLVED note. `satisfiedBy` and "pending registration" now both appear **zero** times.

**Chose a surgical mirror over regeneration deliberately.** The README says regenerate and do not
hand-edit; the standing risk that rule guards against is `.md`/`.html` drift, which a five-string
correction does not create. Regenerating would rebuild ~100KB of hand-tuned interactive scaffolding
(4 tabs, click-to-filter status chips, scroll-spy TOC, copyable RDF compass) to change five strings.
The 2026-06-01 entry below set the precedent — "mirrored surgically (structure/tabs/RDF/scroll-spy
preserved)". Verified after editing: `<div>`/`</div>` 155/155, `<script>` 2/2, `class="tab` 9/9,
mermaid refs 32/32, all unchanged from the pre-edit file; 14 changed lines total.

**Caught during the edit:** the id was first written as `182d7f5f-…` from recall and corrected to
`182d7fd6-6f3e-11f1-866f-7f0be032d30e` against the `.md`. Anyone re-verifying should read the id
from the `.md`, not from memory or from an older HTML build.

**Prior note, now resolved:** the `.html` was left as the 2026-07-03 build, disagreeing with the
`.md` on both points above, and was carried as outstanding until the mirror described here.

## 2026-07-03 — New: Continuous Assessment (Boundary Manager × Projects) model

**Directional heads-up — not hard architecture facts.** Read this as a snapshot of the direction
we're heading, not finalized or shipped truth. Most of it is `[PLANNED]` / `[TBD]` (the doc tags every
claim) — so treat it as where the model is going, build against it with that in mind, and expect it to
move. I'll keep updates flowing as often as I can.
**New architecture doc pair** — `continuous-assessment-model.md` (dense / LLM-ingestible) +
`continuous-assessment-model.html` (interactive, 5 tabs, Mermaid). This is the compliance /
continuous-assessment lens on top of the transparency substrate: **the Boundary is the runtime
control plane (a System), and a Project is the measurement of it.** 3P devs building compliance /
readiness UIs should read this for the current project data model. Headlines: audit-as-a-project is
dead (audit is a continuous verb; the report is a windowed Aperture projection of System state);
**Program / Phase / Assessment** are the primary project **types**; the old single "project flavor"
is now **four orthogonal axes** — `lifecycle` + `types` (structural, SC-008 / task-74) and
`project-context` + `project-domain` (tags, tag PR #8). **`projectTypeId` now carries only the
`project-context` axis** (project/workspace/aperture/thread) — if your code folds engagement /
domain / tier into it, unwind that. Component = a RACI responsibility unit (Boundary "Teams" is dead).

**Terminology:** the ontology-overlay vocabulary is aligned to **System** throughout, and the overlay
doc is now `shacl-owl-system-overlay.html` (its filename changed — update any bookmarks). This is a
label change only — the ontology model, the pipeline, and the Hologram concept are unchanged. Aligned
across `transparency-architecture.{md,html}` + `README.md` as well.

**Authoritative source:** `~/Projects/zb/boundary-projects-mocks/MODEL.md` (kept current by the zb/ui
Director) + zb/ui `.claude/docs/BACKEND_FEATURE_REQUESTS.md` (SC-008 / task-74, tag PR #8, the FR table).

**Files touched:** new `continuous-assessment-model.md` + `.html`; the ontology overlay renamed to
`shacl-owl-system-overlay.html` (System term sweep); `transparency-architecture.md` + `.html` (System
term sweep + a duplicate-id fix in the pipeline diagram); `README.md` (overlay filename + term);
`SYNC-RECIPE.md` (added MODEL.md as a source).

**Unchanged:** the transparency state-machine model, the entangled task-pair seam, and the RDF compass
all stand — this adds the compliance lens and aligns one label; it does not revise the substrate.

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
