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

## Notes / Reference Docs

- [ ] **Glossary** — ZB-specific terms decoded for outsiders (Hydra, Dana, DataProducer, etc.)
- [ ] **Version compatibility matrix** — which SDK + client + Angular-client versions play nice
- [ ] **Known issues & workarounds** — living doc of stuff that's broken but won't be fixed soon
- [ ] **Rate limits & quotas** reference
- [ ] **Error code catalog** — what each ZB error actually means in practice

## Meta / DX Tooling

- [ ] **Claude MCP config** — recommended MCP servers for ZB dev (zerobias MCP + friends)
- [ ] **VS Code snippets** for common SDK patterns
- [ ] **Debug dashboards** — Grafana/Lightstep links + what to watch
- [ ] **Friction → Pattern promotion log** — track which friction entries graduated to patterns

## Submitted by devs

_Add your ideas here with your name/handle. No format required — just get it on the page._

<!-- Example:
- [ ] **{idea name}** — {one-line description} _(@you)_
-->
