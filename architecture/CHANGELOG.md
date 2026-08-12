# Architecture Docs Changelog

Tracks substantive changes to the handoff/architecture docs in this directory
(`transparency-architecture.md` + `.html`, the `patterns/`, `README.md`). Newest first.

**Convention:** the `.html` is generated from / kept in lockstep with the `.md` via the
visual-explainer skill (dark theme · 16px font floor · Mermaid resize+fullscreen). After
editing the `.md`, mirror the change into the `.html` and log both here so the handoff
history is clear for 3P devs and future sessions.

## 2026-08-12 — Churn warning + SDK/client sync: the SCF control APIs are gone, and Project type/lifecycle shipped

**The backend is deep in a refactor of the platform API and the boundary-specific APIs, and this surface will churn for the next few weeks.** Both architecture docs now carry that warning up front (§1.1). Two things you should act on today. **First: six APIs were deleted, not deprecated** — `FrameworkApi`, `InternalControlApi`, `ImplementationStatementApi`, `ControlActivityApi`, `InternalDomainApi` and `SuggestedActivityApi` are gone from `@zerobias-com/platform-sdk` as of **2.0.13**, with no replacement. If you call any of them you are broken now; talk to the backend about where the capability re-lands rather than building a workaround mid-refactor. **Second: `ProjectType` and `ProjectLifecycle` shipped**, and `projectType` is **required, immutable, and single-valued** — so pilot→production graduation mints a new project and keeps the pilot as an immutable origination record. It is never a discriminator flip. Docs that said otherwise have been corrected.

**Sources:** the published npm artifacts (packed and diffed version-by-version, not read from a spec) and the platform repo at `origin/main`. Nothing below is from recall.

### The removals — confirmed at the source, not inferred

Platform commit **`23d27bce`** (2026-07-17), *"work to remove all SCF usage from hydra changes"* — 98 files, **+3,452 / −16,533** — deleted `api/src/api/app/{controlActivity,implementationStatement,internalControl,internalDomain}.yml`, `api/src/api/catalog/{framework,suggestedActivity}.yml`, the whole `BoundaryScfControl` / `BoundaryTeamScfControl` schema family, and rewrote `boundary.yml` (779 lines). It surfaced in **`platform-sdk@2.0.13`** (published 2026-07-23), which went **54 APIs / 1038 models → 48 / 923** in a single release. Bisected across every published version to pin it: `@2.0.12` still has `FrameworkApi`; `@2.0.13` does not.

**The endpoints are gone from the platform API, not merely absent from the generated SDK** — that distinction was checked deliberately, because the SDK is generated from a spec fetched at build time and `platform.yml` is not tracked in git, so SDK absence alone would not have proved it.

**The compliance domain was not removed.** `EvidenceDefinitionApi`, `EvidenceRequestApi`, `ComponentEvidenceApi`, `ComplianceFeatureApi`, `StandardApi`, `CrosswalkApi`, `BenchmarkApi`, `AuditApi` and `FindingApi` all survive. What went is the framework/SCF *catalog-read* layer plus the control-authoring / implementation-statement / control-RACI layer. **This lands hardest on Readiness Center.**

### The additions — the model axes this documentation describes are now typed

Read from the published `.d.ts`, with the release each landed in:

- **2.0.15** (07-28) — `ProjectLifecycle`: `FixedTerm · Evergreen`
- **2.0.16** (07-29) — `ProjectType`: `Standard · Program · Phase · Assessment · Engagement · Rfp · Pilot`; plus `ProjectContextTree` / `Node` / `View` / `ProjectContextOption`
- **2.0.19** (08-12) — `TaskRequirement` / `TaskRequirements` (`satisfied: boolean`, `producedBy`, `producedByTasks`), `ActivityCustomField`, `ProducingActivity`, `IdNameCodeStatusObject`, `PipelineJobAttemptGroup`, `EvidenceDefinitionWithTags`

### Doc corrections these forced

1. **`transparency-architecture.md` §4.5 — was wrong on both halves.** It described a "Pilot ⟷ Production flip" on the same entity, chipped `[PLANNED]`. The axes shipped, and the flip is explicitly ruled out: `projectType` is required, immutable, set at creation, platform-extensible only. Rewritten as convert-and-link, with a precision note that `promotedProjectId` is an *app* convention and **not** a field on the shipped `Project` model.
2. **`continuous-assessment-model.md` §5.1 — the delivered shape departs from the design in three ways.** There is no `types[]` array and no primary-plus-stackable model (`projectType` is one scalar; `Engagement` is a species, not an accessory); the bounded lifecycle value is **`FixedTerm`, not `standard`** (while `Standard` ships as a *projectType* value, which is an easy way to send a value that silently never matches); and `Rfp` / `Pilot` are shipped species the design never anticipated. The design text is kept as rationale, explicitly demoted from field contract.
3. **`continuous-assessment-model.md` §4.1 — re-chipped `[PLANNED]` → `[EXISTS]`.** Program / Phase / Assessment are live species.
4. **`transparency-architecture.md` §10** — the Requirement half is no longer entirely planned; `TaskRequirement` ships. `Assessment`, `Record` and `acceptance_primitive` remain `[PLANNED]`, and the note says so rather than letting the section read as delivered.
5. **New `transparency-architecture.md` §2.1** — the SDK/client surface table: current versions of client, angular-client, platform-sdk, hydra-sdk, zerobias-sdk and mcp, with what changed in each.

### Also worth knowing

- **`zerobias-client` / `zerobias-angular-client` 2.0.15 → 2.0.24 changed nothing functional.** Nine releases, dependency bumps only — verified by packing both versions and diffing: identical file sets, zero `.d.ts` changes, `package.json` the only differing file. Worth stating explicitly so nobody goes hunting for a client change that is not there.
- **`hydra-sdk` 2.0.9** gained a developer-settings surface — `UserDevSettings`, `UserDevSettingsCredentials`, `UserDevSettingsField`, `SaveUserDevSettingsBody`, `GithubOrgAccess`, `SshKeyPair` — with `UserApi`, `ResourceApi`, `ApiKey`/`ApiKeyWithData` and `ResourceSearchFilter` all changed.
- **`zerobias-mcp` 2.0.21** — credential-profile values now accept `${VAR_NAME}` env references, resolved from `process.env` at load and never written back; unset fails as `MISSING_ENV_VAR`; `meta.status` reports the resolved URL.
- **Residue to watch:** `BoundaryFrameworkControlOverviewInternalControl` still ships in 2.0.19 — a model referencing `InternalControl`, whose API no longer exists. Either an incomplete strip or it is still reachable through a surviving API.

**Not touched:** `patterns/*` (the Multica study notes are unaffected) and `boundary-project-mocks/`.

### ✅ `.html` MIRRORED — same day, surgically, no regeneration

Both `.html` files are current with their `.md`. Hand-edited across every parallel representation rather than regenerated, so the interactive shells (tabs, Mermaid resize/fullscreen, scroll-spy TOC, click-to-filter status chips, the JS tooltip glossary) are intact.

**Verified structurally against the committed versions before and after** — `transparency-architecture.html`: `<div>` 170/170 balanced, `<section>` 19/19, `<table>` 10/10, `<script>` 2/2 **unchanged**, `tab-panel` 19 and `mermaid-host` 12 **unchanged**. `continuous-assessment-model.html`: `<div>` 120/120, `<section>` 12/12 unchanged, `<table>` 6/6, `<dt>`/`</dd>` 17/17, `tab-panel` 20 and `mermaid-host` 10 **unchanged**. Both `GLOSSARY` objects extracted and parsed under `node` (18 and 17 keys) so a quoting slip could not break the tooltips silently.

**The fan-out actually hit, per fact:** section prose · table cells · a `.note` callout · the `<dt><dd>` glossary · the embedded raw-markdown glossary block · the JS `GLOSSARY` object · **and a Mermaid node label** (`continuous-assessment-model.html` Diagram 3 carried `lifecycle: standard | evergreen` and `types: primary + stackable accessories` — both corrected, kept ASCII-only with `<br/>` as the sole markup).

**Three stale copies found while mirroring that predate this sync** — all corrected, none of them things this update introduced:

1. **A duplicated `'satisfied_by'` key in the JS `GLOSSARY`** of `transparency-architecture.html` (two identical adjacent lines). Harmless at runtime — a JS object literal takes the last one — but it is a leftover from the 2026-07-21 mirror, whose note said the key was "renamed"; it was evidently duplicated rather than replaced. Removed.
2. **`planned \`satisfies\`` in the embedded raw-markdown glossary block** of the same file — the 2026-07-21 entry corrected `satisfies` to delivered and verified `satisfiedBy` reached zero occurrences, but that check did not catch this second, differently-worded copy in the raw-markdown block. Corrected. **This is exactly the fan-out failure `SYNC-RECIPE.md` warns about, and it survived a mirror that explicitly declared itself complete.**
3. **The `searchProjects` filter claim** ("both structural axes are filterable on `searchProjects` (`lifecycles[]`, `types[]`)"). **There is no `searchProjects` method anywhere, and no lifecycle/projectType filter parameters on any `ProjectApi` method.** The only project-specific query is `ProjectApi.list`, filterable by `boundaryId` / `ownerId` / `status` / `visibility`. Both docs now carry the **replacement**: filter by species or term through **`hydra.ResourceApi.resourceSearch`** with `types: ['project']` and a `conditions[]` predicate (`Condition { property, operation, value }`, 20 operations from `Exists` to `AllOf`), with a worked example. **⛔ `resourceSearch`, not `searchResources`** — both exist on `ResourceApi`; the flat `searchResources` form is **effectively dead and should be treated as deprecated**, though it carries no formal marker. The evidence is usage: every `ResourceApi` search call site in `zb/com/ui` uses `resourceSearch` and none use `searchResources`, and it is also the only one accepting a `ResourceSearchFilter` and therefore `conditions[]`. Two caveats stated in the docs: `Condition.property` is an untyped `string` so `projectType` acceptance is unverified against a live endpoint, and `resourceSearch` returns `ResourceView` (not `Project`), making this filter-then-fetch rather than a one-call read. The shipped `ProjectApi` also gained `getProjectContextTree` / `setProjectContextTree` / `deleteProjectContextTree` / `listAllowedProjectContexts` and the custom-field-default trio, now named in the doc.

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
