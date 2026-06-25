---
status: draft
author: clark
app: general
---

# zb-dx Ideas Board

A living list of tools, patterns, guides, skills, and notes that could improve the developer experience for anyone building on `zerobias-sdk`, `zerobias-client`, or `zerobias-angular-client`.

**How to use this file:**
- Add ideas freely — anything that would have saved you (or someone else) time
- Cross off items as they get created (move them to their eventual home: `patterns/`, `guides/`, `skills/`, `templates/`)
- Link to the resulting artifact when an idea graduates
- No idea is too small — if you typed it out, it was worth capturing

## Patterns (`patterns/`)

- [ ] **auth-bootstrap** — standard login/token/refresh flow across SDK + Angular client, with error recovery
- [ ] **entity-relationships** — how to model/traverse ZB entities (parent/child, tags, permissions) idiomatically
- [ ] **optimistic-updates** — updating UI before server confirms, with rollback
- [ ] **pagination & infinite scroll** — the ZB-native way vs. what devs usually try first
- [ ] **file uploads** — fileservice integration (with progress, retry, cancellation)
- [ ] **real-time subscriptions** — WebSocket/event patterns if ZB supports them
- [ ] **multi-tenant scoping** — org/workspace context propagation
- [ ] **error envelope → UI** — mapping ZB error shapes to toast/form errors consistently
- [ ] **typed query builder wrapper** — TS ergonomics on top of generic SQL/DataProducer

## Guides (`guides/`)

- [ ] **"Your first ZB app in 30 minutes"** — zero to authenticated API call
- [ ] **Angular Client setup** — standalone vs module, ngx-library theming, DI gotchas
- [ ] **Migrating from platformClient to hydraClient**
- [ ] **Debugging ZB API calls** — what headers/tools/logs to enable
- [ ] **Working with generated types** — regeneration workflow, handling drift
- [ ] **Local dev against staging vs prod** — env switching without breaking things
- [ ] **Testing ZB-integrated code** — mocking the client, fixture patterns
- [ ] **Production deploy checklist** — env vars, CORS, rate limits, monitoring

## Skills (`skills/`)

- [ ] **`/zb-scaffold`** — generate a new service/component wired to SDK
- [ ] **`/zb-regen-types`** — regenerate types from latest schema and show diff
- [ ] **`/zb-debug-request`** — paste a failing call, get diagnosis
- [ ] **`/zb-migrate`** — find & suggest fixes for deprecated SDK usage
- [ ] **`/zb-entity`** — scaffold CRUD + types for a new entity end-to-end

## Templates (`templates/`)

- [ ] **Minimal Angular-client starter** (standalone components, ngx-library)
- [ ] **Minimal Node SDK starter** (auth + one query)
- [ ] **ZB + Next.js starter** (SSR-safe client init)
- [ ] **Testing harness** with mocked client + fixtures

## Architecture (`architecture/`)

- [x] **Transparency Architecture overview** — the canonical 3P-dev explanation of Engagement / Project / Board / Task primitives, entangled task pairs, Transparency Center, and the OWL/SHACL/RDF ontology overlay. → [`architecture/transparency-architecture.md`](./architecture/transparency-architecture.md) (+ interactive [`.html`](./architecture/transparency-architecture.html)). _Promoted from SME Mart, 2026-05-22._

## Notes / Reference Docs

- [~] **Glossary** — ZB-specific terms decoded for outsiders (Hydra, Dana, DataProducer, etc.) _Partially covered in [`architecture/transparency-architecture.md`](./architecture/transparency-architecture.md); still want a standalone glossary covering Hydra / Dana / DataProducer / etc._
- [ ] **Version compatibility matrix** — which SDK + client + Angular-client versions play nice
- [ ] **Known issues & workarounds** — living doc of stuff that's broken but won't be fixed soon
- [ ] **Rate limits & quotas** reference
- [ ] **Error code catalog** — what each ZB error actually means in practice

## Meta / DX Tooling

- [ ] **Claude MCP config** — recommended MCP servers for ZB dev (zerobias MCP + friends)
- [ ] **VS Code snippets** for common SDK patterns
- [ ] **Debug dashboards** — Grafana/Lightstep links + what to watch
- [ ] **Friction → Pattern promotion log** — track which friction entries graduated to patterns

## Patterns to Study: Multica

Surfaced by @brian in #zb-dx (2026-04-15) — https://github.com/multica-ai/multica / https://www.multica.ai/

Multica is an open-source human + agent team coordinator (Next.js + Go + Postgres 17, modified Apache 2.0). Can't use directly (license blocks SaaS), but several patterns map cleanly to ZB's transparency/governance/marketplace model.

**Actual architecture (verified in clone, 2026-04-15):**
- Hierarchy: `Workspace → Project(s) → Issue(s)` — workspace is the isolation boundary, projects nest within
- API: REST only (no GraphQL)
- Skills: workspace-scoped records retrieved by name/agent junction (no pgvector, no semantic search, no composition)
- Daemon↔server: REST over HTTP with bearer-token auth
- Audit: separate `activity_log` table keyed by `(workspace_id, issue_id, actor_type, actor_id, action, details)`

**Adoptable patterns:**

- [ ] **Workspace-as-isolation-boundary with projects nested within** — agents, skills, members, settings all scoped to workspace; projects are subdivisions. Model for ZB: map to `Engagement → Workstream(s)` where workstream = phase/party/scope slice. Clear audit boundary + scoped execution.
- [ ] **Local-daemon ↔ cloud-coordinator split** — daemon runs in user's trust boundary (local keys, local LLMs), calls back to coordinator via bearer-token REST. Answers Brian's "local vs cloud" question directly. See `server/internal/daemon/client.go`, `server/internal/handler/daemon.go`.
- [ ] **Multi-LLM auto-detect via CLI presence** — agents pick best-available CLI (Claude Code, Codex, OpenCode) from local PATH rather than lock to one provider. Aligns with ZB's always-multi-LLM stance.
- [ ] **Clean activity_log pattern** — separate append-only audit table with `action` string + `details` JSONB. Not inline with issues. Pattern for multi-party transparency feeds in ZB. See `server/migrations/001_init.up.sql:155`.
- [ ] **Skill-attached-to-agent junction** — simple `agent_skill(agent_id, skill_id)` many-to-many; skill body written to agent's execution env at runtime. Pattern for reusable ZB agent/audit templates. (Note: ZB would likely add pgvector semantic search on top — Multica doesn't.)
- [ ] **Issue-based lightweight governance** — coordination through issues/labels rather than heavy RBAC. Deliberate contrast to Paperclip's heavy org-chart governance. ZB needs a third model: deep governance *plus* transparency, for multi-party commerce.
- [ ] **Compare Paperclip's governance model** — heavy controls (budgets, approvals, org charts) as the counter-example of when deep governance fits better than lightweight.

**NOT adoptable (verified absent):**
- Semantic skill retrieval (no pgvector use despite Postgres extension availability)
- GraphQL layer (REST only)
- Skill composition (plain-text content, no cross-references)
- WebSocket audit streaming (REST polling only)

**Local clone:** `~/Projects/tools/multica/` — explored 2026-04-15, commit on main at time of analysis.

## Protocols to Study: A2UI (agent-driven UI)

Surfaced by @clark (2026-06-25) — https://a2ui.org/ / https://github.com/a2ui-project/a2ui

A2UI is Google's open protocol (Apache 2.0, **v0.9.1 stable / v1.0 RC**, "early public preview", ~15.5k ⭐) for letting an **AI agent emit declarative UI as JSON** that the client renders with its **own native components** — "safe like data, expressive like code." Directly relevant to where ZB is heading (agents responding to tasks/notes; the always-multi-LLM stance; cross-org controlled disclosure).

**How it works:**
- Flat, ID-referenced **JSON** (MIME `application/a2ui+json`) — streamable so an LLM can render progressively. Concepts: Surfaces / Components (from a **vetted catalog**) / data binding / Actions.
- **Security is the point:** agents assemble only pre-approved catalog components — no code execution, no UI injection across trust boundaries.
- Transport: **A2A**. Integrates **AG-UI / CopilotKit** + **MCP**. Ships an A2UI Composer visual editor.
- Renderers: **Lit** (first-class web), **Angular** (roadmap / Theater examples only), React (roadmap), Flutter (GenUI SDK).

**Why it could matter to ZB:**

- [ ] **Agent-emits-rich-UI, safely** — the open answer to "agents return structured UI without executing code." If ZB agents ever produce UI, this is the catalog-constrained pattern. Maps cleanly onto a shared ZB component catalog (ngx-library as the render target).
- [ ] **Cross-trust-boundary UI ↔ the transparency model** — A2UI's headline problem ("how do agents safely send rich UI across trust boundaries?") rhymes with ZB's controlled-disclosure / Transparency-Center thesis. Pattern alignment, **presentation-only** — A2UI must never carry claim/provenance/party-scoping (those stay on the graph).
- [ ] **Platform/SDK-level decision, not per-app** — an agent-UI strategy belongs in the ZB SDK so all 3P UIs share it (same logic as Engagement/Project/Task being platform-owned). Intersects A2A/MCP, which are platform concerns → Kevin/Nic.

**Caveats:** v0.9 maturity; **Angular renderer is roadmap, not first-class** (Lit is); adopting introduces a parallel rendering stack; zero payoff until something *produces* agent UI. Evaluate, don't adopt yet.

**SME Mart tracking:** scoped as a trigger-gated spike — `sme-mart/.planning/director/backlog/040-a2ui-agent-driven-ui-spike.md` (promote when an assistant surface exists or ZB formalizes agent-driven interactions).

## Submitted by devs

_Add your ideas here with your name/handle. No format required — just get it on the page._

<!-- Example:
- [ ] **{idea name}** — {one-line description} _(@you)_
-->
