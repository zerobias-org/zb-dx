---
status: draft
author: clark
app: general
updated: 2026-05-22
---

# ZeroBias Transparency Architecture — 3P Developer Handoff

> **Audience:** Every third-party developer building a UI on the ZeroBias platform — SME Mart (Clark / W3Geekery), Readiness Center (Dan), Work Worlds (Joe), and any future app. This is the single canonical explanation of the shared substrate underneath all of them.
>
> **Status:** Promoted to `zb-dx/architecture/` as the canonical 3P-dev architecture reference, 2026-05-22. Supersedes the prior SME Mart-local handoffs `transparency-center-entangled-tasks-2026-04-21.html` and `shacl-owl-holon-quantum-overlay-2026-05-19-fixed.html` (archived locally). Folds both into one model and corrects the Board section against the **real** shipped `platform.Board` schema. Includes §5.2 corrections verified by Director Parks (SME Mart) against live platform SQL.
>
> **Companion:** [`transparency-architecture.html`](./transparency-architecture.html) — the human-facing interactive version of this same content (tabs, Mermaid diagrams, click-to-filter status, scroll-spy TOC, copyable RDF compass / glossary).

---

## 0. The one thing to understand first

**Everything in this document exists to enable one deliverable: a cross-org, signable, projectable compliance-attestation record.**

Brian's thesis: ZeroBias is a *transparency state machine* between organizations. Two (or more) orgs enter an **Engagement**; inside it they exchange **entangled task pairs** (a demand-side requirement task ⟷ a supply-side satisfaction task); the platform captures every exchange as a hash-chained **Record**; the validated state of the whole thing is published through a **Transparency Center** that any scoped auditor or regulator can read. The final-state output is an **OWL + SHACL + RDF container** carrying the full audit trail of a multi-party assessment — transportable as one signed package.

**That is the entire point of SME Mart, Readiness Center, and Work Worlds. They are three different UIs over the same substrate.** Brian, 2026-04-28: *"All three of you guys could be different UIs. I just want to make sure it's the same damn thing underneath."*

If a design decision in any 3P app makes that final RDF/SHACL container harder to produce, it's the wrong decision. See §11 (RDF compass).

---

## 1. Status taxonomy — read every claim through this lens

This document describes a system that is **partly shipped, partly planned, partly undecided**. Each major construct below is tagged:

| Tag | Meaning |
|---|---|
| **[EXISTS]** | Shipped and verifiable today against ZB MCP / platform source / a live UAT app. |
| **[PLANNED]** | Designed and directionally agreed (Brian/Kevin/Nic), not yet in the schema or APIs. |
| **[TBD]** | Open question or gap — no agreed design yet. A corner we must not paint ourselves into. |

Do not treat a **[PLANNED]** or **[TBD]** construct as callable. Verify any specific API/field claim against ZB MCP (`zerobias_search` / `zerobias_describe`) before coding — memory and handoffs are point-in-time.

---

## 2. The platform ↔ 3P-app relationship

```
                 ┌─────────────────────────────────────────────┐
                 │            ZeroBias Platform                  │
                 │  (the shared substrate — schema of record)    │
                 │                                               │
                 │   Party · Org · User · Boundary               │
                 │   Engagement · Project (nested) · Board · Task│
                 │   Resource · Tag · ResourceLink · ActivityLog │
                 │   [PLANNED] Requirement · Assessment · Record │
                 │   [PLANNED] Transparency Center / MP-Gateway  │
                 └───────────────┬───────────────┬───────────────┘
                                 │ same APIs      │ same primitives
              ┌──────────────────┼───────────────┼──────────────────┐
              ▼                  ▼               ▼                  ▼
        ┌──────────┐      ┌──────────────┐  ┌──────────────┐  (future 3P apps)
        │ SME Mart │      │  Readiness   │  │ Work Worlds  │
        │ (Clark)  │      │  Center (Dan)│  │   (Joe)      │
        └──────────┘      └──────────────┘  └──────────────┘
        marketplace        compliance         collaboration/
        for SMEs           readiness prep      "worlds" UX
```

**[EXISTS]** The platform owns the data model and the APIs. 3P apps are **standalone Angular/Next UIs** that authenticate via the ZB SDK and call the same platform/hub/hydra APIs. None of them own their own copy of Engagement/Project/Task — those are platform entities.

**Where the three apps overlap (Brian directive, BACKLOG #095 — convergence is explicit):**

- **Engagement / Project / nested-tier hierarchy** — all three apps create and render the same `platform.Project` tree. A "project" in SME Mart, a "readiness program" in Readiness Center, and a "world" in Work Worlds should all be the *same underlying entity*, differently labelled and rendered.
- **Transparency entanglement** — the entangled demand/supply task pair (§8) is the cross-app interop seam. A requirement raised in one app's UI can be satisfied by a task in another app's UI, because both are platform Tasks linked by the same link type.
- **Records / audit trail** — the hash-chained Record stream is app-agnostic; it's produced by the platform, not any one UI.

**[TBD]** The exact division of "what each app uniquely renders" vs. "what's shared chrome" is not settled. The convergence sync (Joe + Dan + Clark) is the forum for that. The non-negotiable: **same entities underneath, regardless of UI**.

---

## 3. The Party / Boundary / Engagement frame

Three load-bearing platform concepts that everything else hangs on.

**[EXISTS] Party** — the actor taxonomy: `User / Org / Team / Vendor / Person`. Every scoped entity is owned by, or answers to, a Party. RACI assignments and task ownership reference Party UUIDs (not raw principal IDs).

**[EXISTS] Boundary** — a security/scope perimeter. The unit of "what's in scope." Boundaries nest, and the nesting obeys a **subset chain**: a child's boundary must be a subset of its parent's. *Tighten-never-loosen*, enforced at write time. In ontology terms (§10) a Boundary **is a Holon** — a container + its rules + its contents.

**[EXISTS] Engagement** — the commercial contract between two Parties (demand-side + supply-side). It is the **seam** between two orgs' private worlds, carrying the MSA/SOW, boundary set, and party list. It is an optional **node-role** (a `platform.Project` tagged `engagement`) that **governs** a Project-rooted tree via a typed `governs` ResourceLink — it is *off* the containment axis, not a parent or "outermost boundary." Nothing crosses an Engagement except through (a) a cross-engagement link (§7) or (b) an entangled task pair (§8); the `governs` link itself propagates zero data.

**Invariant (memex):** every SME Mart Project tree is *governed by* a related Engagement (via the `governs` link). The Engagement is a peer node off-axis, not a structural ceiling — the Project tree roots at a Project (`parentId = null`), and the Engagement governs it laterally.

---

## 4. The Projects primitive — the universal structural container

This is the single most important primitive for 3P devs to understand.

**[EXISTS] `platform.Project` is the one nestable structural container for all work below an Engagement.** Brian and Kevin converged on this: rather than separate Engagement / Project / Sub-project / Workspace classes, there is **one Project class** that nests via `parentId`. The tiers differ only by **depth + a user-supplied label**, not by class.

### 4.1 Project entity shape **[EXISTS]**

- `ownerId` — the owning Org (required).
- `parentId` — parent Project (optional; null = top-level project under its Engagement).
- Own **boundary set** + boundary-subset enforcement against parent.
- Own **membership / RBAC** — "Project Scoped Access Rules": `addMember` / `listMembers` / `removeMember` on `platform.Project`. **This is why roster lives on Project, not Board** (see §6).
- Children: Boards, Tasks (via Boards), nested Projects, plus app-specific children (Notes, Files, etc. via schema extensions or resource links).
- Auto-creates a **default Kanban Board** on creation (see §6).

### 4.2 Sub-project boundary rule **[EXISTS]**

A nested (sub-)Project's **primary `boundaryId` must match its parent's** — inherit-or-reject. Resource-linked boundaries (boundaries attached via resource links rather than the primary parent axis) are *not* constrained this way. So: structural nesting tightens scope; lateral resource links can reach across.

### 4.3 The hierarchy — fixed ends, flexible middle

Brian's Hierarchy Editor directive (2026-04-30) — **UPDATED 2026-06-01 (Brian re-blessed):** Engagement is no longer the outermost containment tier and Project is not its "first child." Engagement *governs* a Project-rooted tree via a typed `governs` ResourceLink (off the containment axis; zero data propagation). The corrected tree roots at **Project** (`parentId = null`); "Program" is an optional any-tier node-role tag. The diagram below is retained as the historical 2026-04-30 directive:

```
Engagement                          [FIXED]   — commercial seam, outermost boundary
  Project                           [FIXED]   — always the first child of an Engagement
    «middle tier 1»                 [FLEXIBLE] — default "Workspace"
      «middle tier 2»               [FLEXIBLE] — default "Aperture"
        «middle tier 3»             [FLEXIBLE] — default "Thread"
          Task                      [FIXED]   — atomic unit of work, owned by one Board
            Sub-Task                [FIXED]   — a Task whose parent is another Task
```

- **Fixed ends:** Project (root/top), Task, Sub-Task (bottom). Labels cannot be renamed by users. (Engagement is off-axis — it governs the tree via the `governs` link; it is not the top of the containment tree.)
- **Flexible middle:** one or more **user-customizable tiers** between Project and Task. Default seed chain is `Workspace → Aperture → Thread`. The customer can **add**, **delete**, or **rename** levels per Engagement.
- **Same underlying class.** Every middle tier — whatever it's named — is a `platform.Project` row at a deeper `parentId` depth. Renaming changes the *display label*, not the schema. **[PLANNED]** as a per-engagement template ("Hierarchy Editor" UI); the nesting itself is **[EXISTS]** via `parentId`.

### 4.4 The both-sides-must-match rule **[PLANNED]**

Brian: *"Both side of project must have this same level shit / names. Both side Transparency."* For two parties to entangle tasks (§8) at a given tier, **both sides must mirror the same tier structure and names** at that level. Mismatch = no entanglement at that level. Each tier carries a **per-level publish toggle** — a level may opt out of transparency entirely while siblings publish. **[TBD]** how level-matching is enforced in schema (likely a position-in-template + name marker validated at link-write time).

### 4.5 Project type / lifecycle flips **[PLANNED]**

- **Pilot ⟷ Production flip** — same Project entity; a type discriminator flips on graduation, preserving history/links/sub-projects/tasks. New ZB signups land in pilot type.
- These are discriminator flips on the *same* entity, not migrations to a new entity. Designs must keep the entity stable across the flip.

---

## 5. Three ways to relate Projects (and when to use each)

When you need to associate one unit of work with another, pick the **lightest mechanism that satisfies the scope requirement**:

| Mechanism | Status | Use when | Boundary behavior |
|---|---|---|---|
| **Tag** (hydra Tag) | **[EXISTS]** | Thematic grouping / filtering only. No own scope. | None — a tag is a filter, not a scope. |
| **Nested Project** (`parentId`, "contains") | **[EXISTS]** | A sub-unit needs its **own distinct boundary / transparency partition**. | Child boundary ⊆ parent boundary (subset chain). |
| **ResourceLink** (cross-engagement / lateral) | **[EXISTS]** | Relating across an Engagement boundary, or a non-containment relation (depends_on, relates_to, blocked_by, etc.). | Not constrained by the subset chain; carries its own semantics. |

### 5.1 Tags **[EXISTS]**

- hydra Tags, created via `hydra.Tag.createTag`. Use `tagType: "marketplace"` for all new SME Mart tags (registered 2026-04-29). Names retain the `sme-mart.` prefix convention.
- A "sub-project" can be **just a tag** if it only needs thematic grouping (Brian 2026-04-21: *"tagging construct is perfectly acceptable. As long as those tags are pulled into transparency center."*). Promote to a nested Project only when it needs a distinct boundary.
- Tags are pulled into Transparency Center navigation and Board filter views.

### 5.2 ResourceLinks **[EXISTS]**

- The platform's typed link primitive (hydra `ResourceLink`). The **`linkResources` endpoint** (`POST /resources/{id}/links`) **creates exactly ONE row** in `hydra.resource_link`. The read path (`listResourceLinksExtended`) queries both columns with OR, so the link is **visible from both endpoints** with a `link_side: 'fromSide' | 'toSide'` discriminator — you do **not** need to call from both sides for read visibility.
- For **symmetric link types** (e.g., `relates_to`), one call is fully sufficient.
- For **paired/asymmetric types** (`child_of` ↔ `parent_to`, `blocked_by` ↔ `blocks`, planned `satisfies` ↔ `satisfiedBy`), one call stores ONE row with ONE `link_type` UUID. Whether downstream code expects the partner-type row to also exist is per-consumer: the platform supports inverse-rendering from a single row via `link_type.fromLinkType` / `toLinkType` + the `getLinkTypeByFromToAndFromLinkType` DAO helper, but not every consumer uses it. **Call twice if you need both partner rows materialized.**
- The genuinely one-directional path is the `links[]` array specified inline on `Task.create` — there the reverse link must be added separately.

> *Verified 2026-05-22 against `~/Projects/zb/hydra/dao/sql/hydra/resource/{link,linkResources,listResourceLinksExtended}.sql` (single-INSERT writes, OR-on-both-columns read; no DB triggers mirror writes). Empirical record: memex `memex/zerobias/platform/hydra-resource-links-write-creates-one-row-read-is-bidirectional-via-or-query`.*
- **Cross-engagement "linked project"** — the only path for a coalition (§9). A primary Project in one Engagement links a secondary Project from another Engagement to pull its work in and grant data-plane access.
- **Lateral relations (not containment):** `depends_on`, `relates_to`, `blocked_by`, `supersedes`, `derives_from`, `requires`.
- Task↔Task link type IDs are environment-specific (CI vs UAT differ) — look them up via ZB MCP; do not hardcode across envs.

---

## 6. Boards — the real shipped model (corrects the old handoff)

> ⚠️ **The prior handoff described Board as a speculative polymorphic anchor with parents including Workspace and Transparency, and `boardType ∈ project/engagement/workspace/thread`. That framing is WRONG / superseded.** Below is the real shipped `platform.Board`, verified against `BoardProducerImpl` and ZB MCP `zerobias_describe` (2026-05-20).

### 6.1 `platform.Board` shape **[EXISTS]**

`platform.Board` is **thin**. Fields:

- `name`, `description`, `imageUrl`
- `boardType` — enum **`kanban | list | timeline | calendar`** (NOT project/engagement/workspace/thread)
- `status` — enum `active | archived | deleted`
- `isDefault` — server-set boolean
- **Scope (parent):** at most **one** of `{ boundaryId, projectId, userId }`. Zero explicit parents → org-scoped (the zero-state default). `orgId` is a *derived default sink*, not a 4th selectable parent.
- `ownerId` — always the caller's org (the tenant), independent of the parent axis.
- Tags.

`Board.create` (`NewBoard`) **requires** `name`, `status`, `boardType`. Omit `orgId` (inferred). Provide at most one of `{boundaryId, projectId, userId}`.

`Board.list` does **not** support an `orgIds[]` array filter — single `orgId` only. There is **no** `engagementId` field on Board.

### 6.2 Default board per Project **[EXISTS]**

- Creating a `platform.Project` **auto-creates a default Board** named after the project, `boardType: kanban`, `isDefault: true` (server-set, not user-toggleable).
- **Default boards cannot be deleted** — `DELETE` returns 400. Same veto on default boards for Org/Boundary/User parents.
- Renaming the project does **not** auto-rename its default board (name aligned at creation only). **[TBD]** whether rename should re-align.
- UI implication: the board-delete affordance must show a locked/disabled state for `isDefault: true` — don't offer a soft-confirm then surface a generic 400.

### 6.3 Ad-hoc boards beyond the default **[EXISTS]**

- Beyond the auto-default, you can create additional Boards scoped to a Project (or Boundary / User, or org-default). A Project can host multiple Boards — but **each Task belongs to exactly one Board; tasks never span boards.** Each board holds its own distinct set of tasks.
- A Board is a **rendering view over the Tasks it owns**; a Task's scope flows from its single Board parent.

### 6.4 Board vs Project feature split (per Nic, 2026-05-20) **[EXISTS / PLANNED mix]**

| Feature | Lives on | Status |
|---|---|---|
| Roster / Membership / RBAC | **Project** (Project Scoped Access Rules) | **[EXISTS]** |
| Custom fields | **Board Settings** | **[PLANNED]** — Board Settings UI not designed yet |
| Activity scoping ("which activities in this board") | **Board Settings** | **[PLANNED]** (candidate) |
| RACI (`assigned` / `accountable` / `approvers` / `notified`) | **Task** — RACI lives on the Task itself, *never* on the Board | **[EXISTS]** |

- **Membership & RACI, precisely:** the **Project** holds the membership roster (all project members). Boards and Tasks under that Project are scoped by Project membership — the Board carries no roster of its own. **Per-task RACI lives on the Task**, not the Board.
- **Need a member roster on something? Make it a Project, not a Board.** (This is *why* SME Mart models Vetting as a depth-3 Project — membership.)
- **Need ad-hoc custom metadata today?** Use hydra Tags. Migrate to Board Settings custom fields when they ship (NOT Activity `customFields`, which are catalog-locked).
- **Per-Board activity constraints** aren't available today — coming as Board Settings. Build for "any Activity," anticipate the constraint later.
- A Board config/cog panel should be **future-extensible**: today shows name/description/defaults; later gains custom-fields + activity-scoping panels when Board Settings lands.

### 6.5 Board vs Workspace, restated for the real model

The old handoff put a lot of weight on "Board sits alongside Workspace, polymorphic Board parents incl. Workspace/Transparency." Reframe for the shipped reality:

- **"Workspace" is not a Board parent type and not a class.** It's a **label on a nested `platform.Project`** (a middle tier — §4.3).
- A Board attaches to that nested Project via `projectId` like any other Project. There is no special Workspace or Transparency parent axis.
- **Board filter views ("like epic")** — Brian 2026-04-21 wanted, from within a Board, to filter the rendered task set by sub-project tag / tier / aperture. That's a **query-layer filter** over the Board's tasks; it doesn't re-own tasks. **[PLANNED]** as UI; depends partly on Board Settings.

---

## 7. Tasks

**[EXISTS]** `platform.Task` is the atomic unit of work. SME Mart extends it via schema (`SmeMartTask`) and the platform Task carries:

- `activityId` (required), `name`, `status`, `phase`, priority (numeric: 1000 Critical / 500 High / 200 Normal / 100 Low), rank.
- RACI fields: `assigned` (Responsible — a Party ID), `accountable` (A), `approvers` (C — legacy field name for Consulted), `notified` (I). All take **Party UUIDs**, not principal IDs.
- Owned by exactly **one Board** (or by another Task, for sub-tasks). Scope flows through the Board's single parent.
- `code` = activity prefix + org-scoped counter (e.g., `bug-12345`).
- Links to other Tasks/Resources via `links[]` (`{ resourceId, linkTypeId }`).

**ActivityLog [EXISTS]** — append-only, hash-chained activity log that rolls up through the structural chain (`task → board → project → … → engagement`). This is the precursor to the Record stream (§10).

---

## 8. The entangled Req⟷Sat task pair — `satisfies` / `satisfiedBy`

This is the cross-party seam. It replaces the old `twin_of` framing.

> **Naming change:** the old handoff used a single symmetric `twin_of` link. The current proposal is a **directed pair** of Task↔Task ResourceLinkTypes: **`satisfies` / `satisfiedBy`**, marking an entangled **Requirement⟷Satisfaction** task pair. **[PLANNED]** — these link types are proposed, not yet in the link-type registry. Verify before use.

### 8.1 The model

- A **demand-half task** (the Requirement, "1 of 2") on the demand side states what's needed.
- A **supply-half task** (the Satisfaction/Acceptance, "2 of 2") on the supply side answers it.
- They are linked: the supply task **`satisfies`** the demand task; the demand task is **`satisfiedBy`** the supply task.
- This is the **only** link type that legitimately crosses the commercial (Engagement) boundary. Each task is still single-owned by its own Board on its own side; neither owns the other.

### 8.2 Many-to-one

A single supply-side satisfaction task can be `satisfies`-linked to **multiple** demand-side requirement tasks — the buyer's own requirement plus any number of auditor requirements from linked coalition projects (§9). One piece of evidence can satisfy many parties' asks.

### 8.3 acceptance_primitive **[PLANNED]**

The pair is the unit of measurement. The **`acceptance_primitive`** field on the (planned) Requirement governs how the two halves collapse to a definite contract state:

- `conjunction` (default) — both halves must accept.
- `precedence` — ordered acceptance.
- `disjunction` — either half suffices.

In ontology terms (§10) this is the **measurement operator** that collapses the entangled pair. It maps lexically to SHACL `sh:and` / `sh:xone` / `sh:or`.

### 8.4 RDF-compass constraint

**The entangled-pair structure must survive any Task refactor.** Every Requirement decomposes into exactly 2 linked tasks (or N matched pairs); none orphaned. Flattening into independent unlinked tasks breaks the whole OWL/SHACL framing (§11, C-1).

---

## 9. Transparency Center — the multi-org, multi-project scenario

This is the centerpiece. The reference scenario (carried from the original handoff, still canonical):

### 9.1 The HIS ⟷ Goshen ⟷ ArmorStack coalition

```
                       TRANSPARENCY CENTER (shared surface, opt-in publication)
                                          ▲
        ┌─────────────────────────────────┴─────────────────────────────────┐
        │                          (publishes pairs)                          │
   DEMAND SIDE = buyer + auditor coalition         SUPPLY SIDE = supplier (auditee)
 ┌───────────────────────────────────────┐     ┌──────────────────────────────────┐
 │ Primary Project   HIS ⟷ Goshen         │     │ Supplier Project  HIS ⟷ Goshen     │
 │   REQ "Collect TLS inventory"  #8421 ──┼──┐  │   SAT "Deliver TLS config"   #3307 │
 │   REQ "Prove key rotation"     #8422 ──┼─┐└──┼─▶ satisfies                         │
 │                                         │ └───┼─▶ SAT "Supply KMS rotation"  #3308 │
 │ Linked Project (cross-engagement)       │     │   SAT "Encryption witness"   #3309 │
 │   HIS ⟷ ArmorStack (3PAO)               │     │                                    │
 │   REQ "Witness key rotation"   #A101 ───┼─────┼─▶ satisfies #3309                   │
 │ Linked Project                          │     │                                    │
 │   HIS ⟷ ModelAudit (3PAO)               │     │   SAT "Model lineage manifest" #3411│
 │   REQ "Review model lineage"   #M202 ───┼─────┼─▶ satisfies #3411                   │
 └───────────────────────────────────────┘     └──────────────────────────────────┘
        commercial boundary (Engagement)  ← only `satisfies`/`satisfiedBy` crosses →
```

**The mechanics:**

- **Demand side = a coalition.** The buyer (HIS) has its primary Engagement with the seller (Goshen). The buyer *also* engages multiple independent 3PAO auditors (ArmorStack, ModelAudit), each via its own separate **Buyer⟷Auditor Engagement**.
- **Cross-engagement linking (ResourceLink, §5.2).** Each auditor's project is **linked into the primary Buyer⟷Seller project**. This is the *only* path by which an auditor gains **data-plane access** to the supplier's people / apps / devices / policies — through the primary project's boundaries.
- **Auditors are demand-side**, not a third side. The supplier (auditee) is the lone supply side.
- **One SAT satisfies many REQs.** A single supplier satisfaction task (e.g., #3309 encryption witness bundle) can `satisfies`-link the buyer's own requirement *and* one or more auditors' requirements simultaneously.

**This is the entire point of the platform:** it lets an assessor reach across multiple orgs' boundaries — through opt-in entangled tasks — to attest compliance, without any party giving up sovereignty over its private data.

### 9.2 Opt-in publication **[PLANNED]**

- Default is **private + anonymous**. Nothing is shared until a party publishes it.
- Publication granularity: a party chooses to publish at **tier level** (e.g., a "Workspace" tier), at **tag/sub-project view**, or at **whole-project** level.
- The Transparency Center **navigates by tag** — it can render the same coalition at workspace level, sub-project-tag level, and project level with equal fidelity.

### 9.3 What crosses the seam vs. what stays sovereign

- **Crosses:** the entangled task pair (Requirement ⟷ Satisfaction) and the hash-chained **Records** of the exchange — in a standardized format only.
- **Stays sovereign (never crosses):** each party's internal **Party Policy** (RACI, boundaries, internal eval criteria), its **Boundary Manager** state, and its **Private Execution** (internal prep, scoring, cost analysis).

---

## 10. The Requirement / Assessment / Record contract model

Brian's 2026-05-07 reframe: *"REQUIREMENT is the contract."* The platform gains three new entities **[PLANNED]** that formalize §8–§9.

### 10.1 Three new entities **[PLANNED]**

| Entity | What it is | W3C analog (§11) |
|---|---|---|
| **Requirement** | The contract instance. Demand-half task (1/2) + supply-half task (2/2) + N child Requirements (rules/checks, recursive). Carries `acceptance_primitive`. *"The Requirement IS the contract."* | `owl:Class` + `sh:NodeShape` |
| **Assessment** | The measurement step. Tests whether a Requirement is satisfied. Carries the rule/check, the result (pass/fail/inconclusive), and evidence refs. Many Assessments can roll up into one Requirement's status. | `sh:ValidationReport` |
| **Record** | Hash-chained, append-only memory of every exchange touching a Requirement — end-to-end data + scripts. *"The memory system is the RECORD, full hash too."* Replaces "legibility record." | RDF + **PROV-O** |

Plus **one new field** (`acceptance_primitive` on Requirement) and **one definitional addition** (the word "contract" enters the definition of Requirement). **Zero entity renames** — Engagement, Party, Boundary, RACI all stay.

### 10.2 The three-layer agreement **[EXISTS as behavior / PLANNED as named invariants]**

```
LAYER 1 · PLATFORM   ZB Platform Invariants (system-wide; every Engagement inherits)
   • No irreversible action without a Record entry
   • No scope expansion under unconfirmed state
   • No data egress from a Boundary without an approved task
   • Records are append-only + hash-chained
        │ inherits ▼
LAYER 2 · PARTY      Party Policy (per org: RACI, boundaries, internal criteria)
   demand party  +  supply party  — each sovereign; cannot violate Layer 1
        │ inherits ▼
LAYER 3 · ENGAGEMENT The seam between parties (jointly authored, versioned)
   • MSA / SOW · hierarchy template · N Requirements
   • acceptance_primitive per Requirement
   • inherits both Party policies; bound by Layer 1
```

Validity flows downward; constraints flow upward; lower layers cannot violate higher layers. This maps **exactly** to SHACL 1.2 profile inheritance (§11).

### 10.3 The operational flow

```
Party Policy (D) ─▶ Boundary Manager + Task Approval ─▶ ┐
                                                         REQUIREMENT (contract)
Party Policy (S) ─▶ Boundary Manager + Task Approval ─▶ ┘   │ acceptance_primitive
                                                            ▼
                                            demand-half task ⟷ supply-half task
                                                            │ (collapse)
                                                            ▼
                          Private Execution (D/S, sovereign)  →  ASSESSMENT (satisfaction)
                                                            ▼
                                            TRANSPARENCY VIEW (Requirement + Assessments + Records)
                                                            ▼
                                  TRANSPARENCY MULTI-PROTOCOL GATEWAY (acceptance/denial vehicle)
                                                            ▼
                          RECORD (D entries) ─▶ RECORDS CROSS THE SEAM ◀─ RECORD (S entries)
```

Only the standardized hash-chained Record crosses the seam. Party Policy, Boundary Manager state, and Private Execution stay private.

---

## 11. The ontology overlay — OWL + SHACL + RDF + Holon/Hologram (the culmination)

This is *why* the data shapes matter. The W3C ontology stack is **the language we describe the model in, not a runtime we replace ZB with.** ZB AuditgraphDB stays the schema of record. But every Engagement/Project/Requirement/Task/Record must be **shape-able into a versioned RDF/JSON-LD/Turtle container** carrying the full audit trail — transportable, signable, projectable.

### 11.1 The five-layer stack

| Layer | W3C standard | What it is | Our equivalent |
|---|---|---|---|
| **Meaning (T-Box)** | OWL 2 | What concepts exist + how they relate | Requirement, Assessment, Record, Engagement, Party, Boundary, Task, RACI — the ZB class system |
| **Constraint (S-Box)** | SHACL 1.2 | What well-formed data looks like; versioned, packageable, jointly-authored | Boundary Manager checks · `acceptance_primitive` · per-engagement hierarchy template · ZB validation pipeline |
| **Data (A-Box)** | RDF (+RDF-star) | The actual triples + statement-level provenance | ZB AuditgraphDB (Resource/Tag/Link/Task) + hash-chained Records |
| **Holon** | (named sub-graph) | A bounded container: contents + rules, self-similar nesting | A **Boundary** + its Requirement tree + scoped Resources |
| **Hologram** | (state projection) | A Holon's validated state at time T, projected onto any surface | The **Transparency View** + MP-Gateway output (2D today; 3D/audio/world-model tomorrow) |

### 11.2 Canonical vocabulary mapping

| ZB concept (canonical) | W3C / standards analog |
|---|---|
| Requirement (the contract) | `owl:Class` + `sh:NodeShape`; child requirements = `sh:node` recursion |
| Assessment | `sh:ValidationReport` (`sh:conforms`, `sh:result`) |
| Record (hash-chained) | RDF + PROV-O (`prov:Activity`, `prov:wasGeneratedBy`) + hash chain for tamper-evidence |
| `acceptance_primitive` (conjunction/precedence/disjunction) | `sh:and` / `sh:xone` (ordered) / `sh:or` |
| Boundary Manager (scope/policy/RACI) | SHACL Property Shapes + SHACL Rules (derive new facts) |
| Engagement | **SHACL Profile** (packaged · versioned · jointly authored) — both parties pin a version |
| Transparency View | SHACL ValidationReport renderer + provenance viewer (TopBraid / Jena / RDF4J) |
| Multi-Protocol Gateway | RDF content-negotiation + signed serializations (Turtle / JSON-LD / N-Quads / TriG) |
| Boundary + scoped Requirements + Resources | **Holon** (named sub-graph) |
| Transparency surface at a moment | **Hologram** (validated sub-graph projection) |

### 11.3 Coverage extensions (plug-in SHACL packages on the Engagement profile)

| Concern | Ontology |
|---|---|
| Commerce / permissions / obligations | **ODRL** (W3C Rec) |
| Legal / GDPR / jurisdiction | **DPV** + smashHitCore + DSAP |
| Data-sharing agreements | DSAP + ODRL + DPV composition |
| Payment / billing / settlement | ODRL duty + Schema.org `PaymentMethod`/`MonetaryAmount` |
| Security frameworks (SOC2 / DISA STIG / CIS / NIST 800-53) | **OSCAL** (NIST) + framework-specific SHACL packages |

### 11.4 Holon → Assessment → Hologram pipeline

A **Holon** (Container = thing-being-assessed, e.g. a host/system as ZB Boundary + scoped Resources; Rules = a config baseline like DISA STIG/CIS as a SHACL package) is fed to an **Assessment** (SHACL validation engine → `sh:ValidationReport`), which emits a **Hologram** (validated sub-graph at time T) that renders onto any surface: 2D dashboard, 3D world model, audio brief, or a **time-series** "audit movie" (append-only Records replayed against the SHACL package at each timestamp — the time series comes for free).

**Holographic-principle parallel (precise, not loose):** a SHACL NodeShape *is* a boundary contract that fully determines admissible interior data — boundary information determines the interior, exactly like the physics principle. Boundary → SHACL package → determined interior Records.

### 11.5 Quantum framing (internal narrative only)

The entangled task pair behaves like a two-qubit system: paired state (entangled by Requirement id) → joint measurement (`acceptance_primitive`) → classical readout (Record). Porting onto a quantum neutral-atoms substrate later is a *transcription, not a redesign*. **Lead external pitches with SHACL/OWL/RDF; quantum is a parenthetical until the substrate path is concrete.**

### 11.6 What we adopt vs. don't (for 3P devs)

**Adopt:** name the model in W3C vocabulary in spec docs; publish per-engagement SHACL packages as versioned artifacts; position the Hierarchy Editor as a SHACL UI; add RDF/JSON-LD output to the gateway; use PROV-O for Record provenance; add ODRL+DPV shapes when money/PII is involved.

**Don't (scope walls — platform-team work, NOT 3P frontend):** replace AuditgraphDB with a triplestore; run full OWL reasoning in the hot path; lock to SHACL 1.2 Node Expressions (still FPWD); write the OWL/SHACL artifact before the ZB schema lands; build the MP-Gateway RDF endpoint; build the OSCAL→SHACL binding.

---

## 12. The RDF compass — 5 constraints every 3P design must satisfy

Any design that touches Engagement / Project / Task / Vetting / Record shapes MUST pass these. A failure needs explicit remediation or a Director-level "accept the gap, file debt" call. (Source: `.planning/docs/RDF-COMPASS.md`.)

| # | Check | Pass criterion |
|---|---|---|
| **C-1** | Preserves the **entangled demand-half + supply-half task pair**? | Every Requirement decomposes into exactly 2 linked tasks (or N matched pairs); none orphaned. |
| **C-2** | Every field **round-trips to RDF triples** without loss? | Fields typed, atomic, predicate-nameable. No mixed-axis strings, no positional ordering. |
| **C-3** | Records **append-only + hash-chainable**? | No in-place mutation; PROV-O attribution preservable; tamper-evidence intact. |
| **C-4** | **Party-boundary scoping** present (Holon projection computable)? | Every entity under an Engagement carries a Party UUID (or is unambiguously inferable from parent). |
| **C-5** | Engagement-pinned **SHACL profile / Requirement-set version** explicit? | Requirement registry has a version anchor at engagement creation; UI never silently swaps versions under live data. |

---

## 13. Gaps & open questions (the honest list)

**[TBD] / open:**

1. **Hierarchy level-matching enforcement** — how is "both sides must mirror tier names" enforced in schema for entanglement? (per-link level marker vs. position+name validation)
2. **Board Settings** — custom fields + per-Board activity scoping are designed-not-built. RACI-in-Board is uncertain.
3. **`satisfies` / `satisfiedBy` link types** — proposed, not yet in the link-type registry. Need Nic to register them (per env).
4. **Requirement / Assessment / Record entities** — agreed in narrative, not yet in the AuditgraphDB schema.
5. **Transparency Center surface + Multi-Protocol Gateway** — the publication/query layer and the RDF content-negotiation endpoint are platform-team scope, not yet built.
6. **Holon / Hologram vocabulary adoption** — schema-of-record entities vs. narrative-only language? (Brian/Kevin/Nic decision; BACKLOG-110)
7. **Per-engagement SHACL profile versioning** — does the platform support it today, or is it a platform-team gap? (compass C-5)
8. **PROV-O on Records** — when do ZB Records gain PROV-O attribution surfaces?
9. **JSONL/RDF container shape** — Brian's "final deliverable" references JSONL/RDF; is it JSONL-of-quads, JSON-LD, TriG? Pending platform spec.
10. **OSCAL → SHACL binding** — a spike, likely Kevin/Nic/external; the path to a real (not metaphorical) STIG/SOC2 Hologram.
11. **3P app boundary of responsibility** — exactly what each of SME Mart / Readiness Center / Work Worlds uniquely renders vs. shares is unsettled (BACKLOG #095 convergence sync).

**Pinned decision (not a gap):** mirrored Engagement+Vetting shape is locked as **Option 3 — single Vetting Board, perspective-aware projection** (2026-05-19 Director decision; satisfies compass C-1 + C-4). BACKLOG-108.

---

## 14. Glossary (quick reference)

- **Engagement** — commercial seam between two Parties; an optional node-role (`Project` tagged `engagement`) that *governs* a Project tree via the `governs` link, off the containment axis (not a parent/outermost-boundary). *(SHACL Profile.)*
- **Project** — the one nestable structural container; tiers = depth + label. *(OWL class.)*
- **Board** — thin rendering view over Tasks; `boardType ∈ kanban/list/timeline/calendar`; parent = one of boundary/project/user (org default). Auto-default per Project.
- **Task** — atomic unit; owned by one Board; RACI via Party UUIDs.
- **Sub-Task** — Task owned by another Task.
- **Tag** — hydra filter, no scope (`tagType: marketplace`).
- **ResourceLink** — typed link (cross-engagement / lateral). `linkResources` stores ONE row; the read path is OR-on-both-columns so it's visible from both endpoints with a `link_side` discriminator. For paired/asymmetric types (`child_of` ↔ `parent_to`, planned `satisfies` ↔ `satisfiedBy`) call twice if you need both partner rows materialized.
- **`satisfies` / `satisfiedBy`** — proposed directed Task↔Task link for the entangled Req⟷Sat pair (replaces `twin_of`).
- **Requirement** — the contract: demand-half + supply-half task. *(OWL class + SHACL NodeShape.)* [PLANNED]
- **Assessment** — measurement of satisfaction. *(SHACL ValidationReport.)* [PLANNED]
- **Record** — hash-chained append-only memory. *(RDF + PROV-O.)* [PLANNED]
- **acceptance_primitive** — conjunction/precedence/disjunction collapse operator. *(sh:and/sh:xone/sh:or.)* [PLANNED]
- **Holon** — a Boundary as a bounded sub-graph (container + rules + contents).
- **Hologram** — a Holon's validated state at time T, projectable onto any surface.
- **Transparency Center** — the shared, opt-in publication surface over entangled pairs.
- **Multi-Protocol Gateway** — the acceptance/denial vehicle; RDF content-negotiation across the seam. [PLANNED]
- **Boundary** — scope perimeter; subset chain (tighten-never-loosen); *is a Holon*.
- **Party** — actor (User/Org/Team/Vendor/Person); owns/answers-for scoped entities.

---

**Verify before coding.** Every API/field/link-type claim here is point-in-time. Authoritative sources: ZB MCP (`zerobias_search` / `zerobias_describe`), live ZB platform source, actual SDK source. The deprecated Next.js SME Mart prototype is NOT authoritative. See `.planning/docs/SDK_VERIFICATION_SOURCES.md`.
