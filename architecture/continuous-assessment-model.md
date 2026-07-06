---
status: draft
author: clark
app: general
updated: 2026-07-03
---

# Continuous Assessment — the Boundary Manager × Projects model (3P Developer Handoff)

> **Audience:** Every third-party developer building on the ZeroBias platform — SME Mart (Clark / W3Geekery), Readiness Center (Dan), Work Worlds (Joe), and any future app. This doc explains the **compliance / continuous-assessment** model that the Boundary Manager and Projects apps render, so you build against the current data model rather than a stale one.
>
> **Companion:** [`continuous-assessment-model.html`](./continuous-assessment-model.html) — the interactive version (tabs, Mermaid, mocks).
>
> **Sibling doc:** [`transparency-architecture.md`](./transparency-architecture.md) is the transparency *state-machine* substrate (Engagement / Project / Board / Task / entangled task pairs / Transparency Center / RDF compass). **This** doc is the compliance/continuous-assessment *lens* on top of it — the two are complementary, not competing. Where they overlap (Boundary, Project, RDF compass), the state-machine doc owns the primitive and this doc owns the compliance framing.

---

## 0. The one thing to understand first

**ZeroBias sells Continuous Assessment via automation — not audits.** Brian's positioning: *"we are continuous assessment via automation. Period. Buyers will not buy audits; they buy continuous assessment via automation."*

Two apps, two roles, one seam:

- **The Boundary is the runtime control plane** — the live, operating controls / tools / data / IAM / components *as they run*. It holds reality and is **continuously assessed**. It does not measure itself.
- **A Project is the measurement of that runtime** — a requirement-product measurement of the Boundary's system state, rolled up by domain, in layerable lenses.

If a design in any 3P app treats the boundary as a static manifest, or treats "an audit" as a first-class project/pipeline, it's the wrong design. **Audit-as-a-project is dead** (§4). The audit *report* still exists — it's just a windowed projection of continuous system state, not a separate thing you build.

---

## 1. Status taxonomy — read every claim through this lens

| Tag | Meaning |
|---|---|
| **[EXISTS]** | Shipped and verifiable today against ZB MCP / platform source / a live UAT app. |
| **[PLANNED]** | Designed and directionally agreed (Brian / Kevin / Nic), filed as a backend FR, not yet in the schema or APIs. |
| **[TBD]** | Open question or naming not yet ratified — no agreed design. Don't paint into it. |

Do not treat **[PLANNED]** / **[TBD]** as callable. Verify any specific API/field claim against ZB MCP (`zerobias_search` / `zerobias_describe`) before coding — this doc is point-in-time. Backend FR ids (task-N) are cited inline; the tracker of record is zb/ui `.claude/docs/BACKEND_FEATURE_REQUESTS.md`.

---

## 2. Naming — what the thing is called at each layer

It is **not** called a "project." A `platform.Project` is only the structural container. Names by layer:

| Layer | Name |
|---|---|
| Product / what buyers buy | **Continuous Assessment (via automation)** |
| In-app umbrella | a **Compliance Readiness** program (demo umbrella: "ZeroBias Compliance Readiness") |
| Under the hood | Projects (a **Program** + its **Phases**) that **measure** a Boundary (a System) |

**[TBD]** Naming is not ratified with Brian / Kevin. Treat "Continuous Assessment" as the working product name and "Compliance Readiness" as the in-app program label.

---

## 3. The swim-lane — two apps, two roles

- **Boundary Manager App = the System (runtime control plane).** The live, operating controls / tools / data / IAM / components as they run — not a static manifest. Continuously assessed; does **not** self-measure. Surfaces: Components / Software / Tools inventories, per-instance SBOMs, IAM, controls. Each surface points to *where the project measures it* — it shows reality but does not grade itself.
- **Projects App = the measurement + commitment layer.** Requirement-product **measurements** of the System's runtime, organized **by domain**, in **layerable lenses**; plus the Program/Phase lifecycle and the Transparency Center.

**Vocabulary discipline (load-bearing):** in the project lens say *measured / measurement / readiness*. The **requirement product is the instrument**; the **System runtime is the measured**. The project *measures* the runtime — it does not *own* it. Never say "the boundary's control" in the project lens.

**Findings = failed measurements** (missing-component / inventory-mismatch / missing-tool / ineffective-control) on the Findings board. Inventory-completeness and tool-coverage are **measurements** (requirement products) on a measurement layer — not a boundary-side "control group."

---

## 4. Core model

### 4.1 Program / Phase / Assessment — the primary types **[PLANNED]** (SC-008 / task-74)

- **Program** (`type=program`, `lifecycle=evergreen`) — the ongoing umbrella that never completes ("the promise"). **Owns the canonical requirement set + the phase plan**; related children roll up to it; a top-tier program serves as a **portfolio**. Discharges its requirements to the Boundary/System. Carries an explicit **version anchor** on its requirement set (the version any report cites). *(Absorbs the earlier "commitment" concept — commitment = program(evergreen).)*
- **Phase** (`type=phase`, `lifecycle=standard`) — a bounded **build** project that **rolls its requirements up to a program**; on completion its residual **promotes** to the program's **capabilities** (this defines "phase done"). Requires a program parent.
- **Assessment** (`type=assessment`, `lifecycle=standard`) — a bounded project that performs an assessment ("audit without saying audit") — the point-in-time consumer that renders a deliverable from continuous system state (e.g. the blind-assessor's project). **[TBD]** assessment-vs-audit framing is a Brian / Kevin call.

### 4.2 Assessment (the verb) → System state (the noun) → Aperture (the lens)

- **Audit is a continuous VERB, not a project.** The one-time / annual / manual audit-as-a-deliverable is **dead** (Brian). Audit-as-a-project must never be reintroduced.
- **Stateful assessment** — automated assessment across all System components, near-real-time, at extreme granularity/frequency → a **Component state firehose**, rolled up at project/program layers.
- **System state** — the noun: a validated-assessment snapshot at an interval ("state over point").
- **Aperture** — the **lens** (scope × time-window × frequency) that turns the firehose into any report: narrow = a point-in-time snapshot, wide = a year-long dataset. **Aperture's primary job is DATA REDUCTION** — it makes an unmanageably large firehose consumable. It reduces the **view**, never the underlying records. *(Kevin 2026-07-03: aperture-the-lens is a **boundary/runtime** concept, not a project — distinct from the inert `aperture` context tag in §5.)*
- A traditional "audit report" = **residual exhaust** — a windowed Aperture projection of system state, generated at any point. Old-school customers still get one; it's a report, not a separate pipeline.

### 4.3 The assessment primitive (Kevin ↔ Brian reconciled)

- Kevin's "audit = something reviewed as proof, passes or fails" = the **assessment primitive** = a **Check → Finding** (pass/fail), invariant whether run by people or bots. It survives and *generates* system state.
- Brian's "audit is worthless" = the packaged annual deliverable. Both are true at different levels.

### 4.4 Assessor marketplace + Transparency Center **[PLANNED / TBD]**

- **3PAO / assessor = BLIND.** A separate party/project, entangled at the **task level via linked projects** into the seller's stack, working against a **digital twin**. Builds only **automated assessment logic → findings**. ZB dispatches to many blind assessors at scale and **scores** their logic (a marketplace; the logic is a scored product).
- **Transparency Center** — buyers / regulators / inspectors general and sellers consume findings.
- **AuditCrowd — the ranked/scored assessor crowd at extreme scale** (Brian 2026-07-03). Thousands → millions of specialists; each supplier is assessed by ~**500 different assessors on different parts of the stack** (variation-maximizing); ZB ranks + scores them.
- **Reflexive assessment — the readiness mesh.** The assessors, **and all** transparency-marketplace participants, are themselves **inside the ZB platform boundary and continuously assessed** — their workstations boundary-scoped and hardened. Brian's name for the whole: a **"readiness mesh marketplace."**
- **Assessment-at-scale is the AI moat.** The mechanized assessors generate assessment logic/data that **trains ZB's own SLM/LLM** — depth + variation as the differentiator.

### 4.5 Component **[PLANNED]**

A boundary **Component** = a **responsibility unit** whose spine is **RACI** (Responsible / Accountable / Consulted / Informed over Parties + Roles). Single or grouped (same RACI → one component). Broad OSCAL-style types (software / service / hardware / … / policy / plan / procedure / standard) × technical|documentary. Carries an evidence obligation. **Boundary "Teams" is dead — replaced by Parties + Roles + RACI.**

---

## 5. Structural vs Tags — the four axes  ← the part that touches `projectTypeId`

The project model has **four axes** — two **structural** (the platform acts on them) and two **tag** axes (organizational / filtering). *(Kevin's 2026-07-03 revision; replaces the earlier mode/features + project-type shape.)*

### 5.1 Structural — attributes on `platform.Project` **[PLANNED]** (SC-008 / task-74)

- **`lifecycle`** — enum, single-valued: `standard` (temporary; has an end) | `evergreen` (ongoing; never completes). **Defaults to `standard` on create.** A primary type may dictate it (program → evergreen; phase / assessment → standard).
- **`types`** — the logic/behavior a project carries:
  - one **primary** type: `program` (evergreen umbrella) | `phase` (rolls requirements up to a program) | `assessment` (bounded assessment).
  - plus any number of **stackable** accessory types: `engagement`, `transparency-entangled`, `template`, + domain-specific (extensible).
  - **primary-first, with constraints** — the primary type can force exclusion of others or require a structure (a phase needs a program parent). Some types stack; some are mutually exclusive.
  - **types are an extensibility point** — a base set ships; customers/orgs author their own feature packs (clinical, financial: templates + fields + widgets + workflow scripts) and load them **without core software changes** ("like making a Zoho app"). Load-bearing types (program/phase) are coded at the factory; accessory features are user-loadable. A type **bundles a lifecycle + a feature-set**, and may imply a lifecycle (program ⇒ evergreen).
  - **entanglement** (`transparency-entangled`) is a **feature, not structural** — mechanically *watch-a-change-in-one-project-and-enact-it-in-another* ("effectively copy-paste").
- Both filterable on `searchProjects` (`lifecycles[]`, `types[]`). Supersedes the engagement-query driver of PS-003 / PS-004; **engagement is now a `type`**.

### 5.2 Tags — global tag-types **[PLANNED]** (tag PR #8, `zerobias-com/tag`)

- **`project-context`** — an organizational label: `project`, `workspace`, `aperture`, `thread` (extensible). "Tree-like if we want" — but **NOT the structural parent-child hierarchy** (the real containment tree is separate; context is just labels layered on it). **Not load-bearing** — an inert tag. **Renamed from `project-type` 2026-07-03.** **This is the axis `projectTypeId` points at.**
- **`project-domain`** — the domain / GRC-vertical axis: `compliance`, `security`, `privacy`, `financial`, `clinical`, `quality`, `legal`, `esg`, `supply-chain`.

**Rule: load-bearing ⇒ NOT a tag.** `lifecycle` / `types` drive behavior/structure → structural. `project-context` / `project-domain` organize → tags. **`project-tier` is gone** — depth is derivable from the containment tree; it is not a stored matching label.

### 5.3 What this means for `projectTypeId`

- **`projectTypeId` = the `project-context` tag axis** (project / workspace / aperture / thread) — an organizational/nesting label, **not load-bearing**, and "tree-like if we want" (NOT an enforced matching depth label — entangled cross-org projects do **not** have to match).
- The old single "project flavor" is now **four orthogonal axes**: **context** (`projectTypeId` → project-context tag) / **lifecycle** (standard|evergreen, structural) / **types** (program/phase/assessment + accessories, structural) / **domain** (project-domain tag).
- Net: `projectTypeId` carries **only** the context/nesting axis. Engagement, program, phase are **types** (structural); compliance/security/etc. are **domain** tags. If `projectTypeId` currently folds those in, that's what to unwind.

---

## 6. RDF Compass alignment

The model lands on the RDF-Compass vocabulary (Brian's "designs must serialize to a versioned RDF / JSON-LD / Turtle container"). See `transparency-architecture.md` §11–12 for the full compass; the compliance-specific mappings:

- **Requirement = `owl:Class` + `sh:NodeShape`**; a **Check = SHACL validation**; a **Finding = `sh:ValidationResult`**; pass/fail = `sh:conforms` (= validation-as-satisfaction, the C-1 amendment).
- **Boundary = System.** **System state** = the validated-state snapshot. **Aperture** = the projection over the System that produces system state.
- **Continuous assessment = the append-only, hash-chained Records (C-3) + PROV-O provenance stream** — read surface is the Activity History endpoints (PS-006 / TS-002, task-46 / task-47, **[PLANNED]**).
- **The evergreen program must pin its requirement-set version (C-5)**; reports cite the version.
- **Transparency Center report = the versioned RDF / JSON-LD / Turtle container** — Brian's "residual exhaust" is the same artifact as the compass's interchange deliverable.

**Design guard:** the assessment store must be append-only / hash-chained (C-3). "Reduce the data set" means Aperture narrows the *view*, never prunes the ledger.

---

## 7. Backend FRs (prod Backend Feature Requests board)

| FR | id | What | Owner | Status |
|---|---|---|---|---|
| SC-008 | task-74 | `lifecycle` + `types` structural attrs on `platform.Project` + `searchProjects` filters | Nic | **[PLANNED]** (related task-34) |
| PS-003 | task-30 | generic `tagIds[]` filter on projectSearch (re-scoped off engagement) | Nic | **[PLANNED]** open |
| PS-004 | task-34 | `searchProjects` filter for Engagement Projects | Nic | **[EXISTS]** DONE |
| RC-001 | task-73 | product catalog → requirement-products (private + global; pricing/licensing) | Kevin | **[TBD]** interim |
| CAL-001/002 | task-67/68 | Calendar model + event endpoints | Nic | **[PLANNED]** |
| PS-006 / TS-002 | task-46/47 | Project/Task change history (RDF-Compass provenance read surface) | Chris | **[PLANNED]** |
| tag PR #8 | — | `project-context` + `project-domain` tag-types (`zerobias-com/tag`) | Nic | **[PLANNED]** ready |

---

## 8. Glossary (quick reference)

- **Continuous Assessment** — the product: continuous, automated measurement of a runtime System against a requirement set. What buyers buy (not audits).
- **Boundary / System** — the runtime control plane: live controls / tools / data / IAM / components as they run. Continuously assessed; does not self-measure.
- **System state** — a validated-assessment snapshot of the System at an interval ("state over point").
- **Aperture** — the lens (scope × time-window × frequency) that reduces the assessment firehose to a consumable view; reduces the *view*, never the ledger.
- **Program** — evergreen umbrella project (`type=program`); owns the requirement set + phase plan + version anchor; a top-tier program is a portfolio.
- **Phase** — bounded build project (`type=phase`); rolls requirements up to a program; residual promotes to program capabilities on completion.
- **Assessment** — bounded project (`type=assessment`) that renders a deliverable from continuous system state.
- **Check → Finding** — the assessment primitive: a pass/fail review, invariant whether run by people or bots; generates system state.
- **Finding** — a failed measurement (missing-component / inventory-mismatch / missing-tool / ineffective-control).
- **Component** — a boundary responsibility unit; spine is RACI over Parties + Roles; broad OSCAL-style types; carries an evidence obligation. (Boundary "Teams" is dead.)
- **lifecycle** — structural enum on `platform.Project`: `standard` | `evergreen`.
- **types** — structural: one primary (program/phase/assessment) + stackable accessories; an extensibility point (user-loadable feature packs).
- **project-context** — inert tag axis (project/workspace/aperture/thread); what `projectTypeId` points at; not load-bearing.
- **project-domain** — tag axis: compliance/security/privacy/financial/clinical/quality/legal/esg/supply-chain.
- **AuditCrowd** — the ranked/scored blind-assessor crowd at extreme scale; ~500 assessors per supplier, variation-maximizing.
- **Readiness mesh** — every marketplace participant (assessors included) is inside the ZB boundary and continuously assessed.

---

## 9. Sources

- Model source of truth: `~/Projects/zb/boundary-projects-mocks/MODEL.md` (kept current by the zb/ui Director; the mocks live in the same folder — see the companion `.html`).
- Backend FRs: zb/ui `.claude/docs/BACKEND_FEATURE_REQUESTS.md`.
- RDF compass + transparency substrate: `transparency-architecture.md` (this folder).
