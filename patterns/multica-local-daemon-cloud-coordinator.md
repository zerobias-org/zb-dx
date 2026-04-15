---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Local Daemon ↔ Cloud Coordinator Split

Execution happens on the user's machine (local daemon with user's LLM keys, filesystem, and network trust). Coordination happens in the cloud (tasks, audit, team visibility). They talk via authenticated REST.

## Architecture

```
┌─────────────────────────────────┐      ┌────────────────────────────────┐
│  USER'S MACHINE                 │      │  CLOUD (or self-hosted)        │
│                                 │      │                                │
│  ┌───────────────────────────┐  │      │  ┌──────────────────────────┐  │
│  │  DAEMON                   │  │      │  │  COORDINATOR             │  │
│  │  • holds LLM API keys     │  │      │  │  • tasks, projects       │  │
│  │  • runs CLI agents        │──┼──────┼─▶│  • activity_log          │  │
│  │  • filesystem access      │  │ REST │  │  • team membership       │  │
│  │  • bearer token auth      │  │ HTTPS│  │  • no user secrets       │  │
│  └───────────────────────────┘  │      │  └──────────────────────────┘  │
└─────────────────────────────────┘      └────────────────────────────────┘
```

## Core principle

> **Secrets never leave the trust boundary where they were created.**

- API keys live on the user's machine
- LLM API calls go user → LLM provider (not through cloud)
- Source code stays on the user's machine
- Cloud stores only coordination state: tasks, audit, team data

## Protocol (from Multica)

REST over HTTPS with bearer token auth. Endpoints:
- `POST /api/daemon/runtimes/{runtimeId}/tasks/claim` — daemon picks up work
- `POST /api/daemon/tasks/{taskId}/start` — claimed task starts
- `POST /api/daemon/tasks/{taskId}/messages` — progress/output streaming
- `POST /api/daemon/tasks/{taskId}/progress` — heartbeat
- `POST /api/daemon/tasks/{taskId}/complete` — terminal state

Token kinds:
- **Daemon tokens** (`mdt_*` prefix) — scoped to workspace, long-lived, revokable
- **Personal access tokens** — per-user, workspace-scoped
- **User JWT fallback** — short-lived, for interactive flows

## Why this matters

| Concern | Cloud-only | Local-only | Split (daemon + coordinator) |
|---------|------------|------------|------------------------------|
| User holds secrets | ✗ (uploaded) | ✓ | ✓ |
| Team coordination | ✓ | ✗ | ✓ |
| Audit trail | ✓ | ✗ | ✓ |
| Works offline | ✗ | ✓ | Partial (daemon can queue) |
| Vendor can see user code | ✓ | ✗ | ✗ |

For ZB's "deep security for the paranoid" positioning, the split model is the only credible answer. Brian's "local vs cloud" question is really "why not both" — and the daemon pattern is how.

## When to apply

- Any app where users have strong opinions about data residency
- Regulated industries (legal, health, finance, defense) where source/data can't leave premises
- Platforms that need both individual trust and team visibility

## Tradeoffs

- More moving parts — must distribute and update the daemon binary
- Partial offline only — daemon can queue but coordination UI needs connectivity
- Token management is first-class concern, not an afterthought

## Extensions for ZB

- **Engagement-scoped daemon tokens** — token bound to a specific multi-party engagement, auto-revoked when engagement ends
- **Per-boundary execution context** — daemon can refuse to run tasks tagged with boundaries the machine doesn't satisfy (e.g., residency-US task on a non-US machine)
- **Streaming via WebSocket** (Multica doesn't yet) — real-time transparency feeds to parties

## Source

Multica: `server/internal/daemon/client.go:39-52` (client protocol), `server/internal/handler/daemon.go:29-46` (auth/token handling), `server/cmd/multica/cmd_daemon*.go` (daemon lifecycle).
