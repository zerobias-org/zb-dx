---
status: draft
author: clark
app: general
source: https://github.com/multica-ai/multica
updated: 2026-04-15
---

# Multi-LLM Auto-Detect via CLI Presence

Agents pick the best-available LLM CLI from the local `PATH` at runtime. No hardcoded provider. No vendor lock-in. Users bring their own keys for whichever CLIs they have installed.

## How Multica does it

The daemon enumerates known CLIs at start and reports which are available:
- Claude Code (`claude`)
- Codex (`codex`)
- OpenCode (`opencode`)
- OpenClaw (`openclaw`)

Tasks can specify a preferred runtime, or defer to daemon default (first available).

## Why it works

- **No credential exchange** — keys stay in each CLI's config, never touched by the daemon
- **User choice preserved** — power users can install all four, casual users install one
- **Graceful degradation** — if preferred CLI is missing, fall back without failing
- **Benchmarking is free** — run the same task across CLIs and compare outputs

## ZB application

Aligns with ZB's always-multi-LLM stance. For any ZB agent/skill execution:
1. Daemon enumerates available CLIs
2. Task specifies capabilities required (code, vision, long-context, etc.)
3. Pick CLI that matches capabilities AND is installed
4. Pass task to CLI via stdin/args; collect output

## Data model

```
runtime
├── id
├── daemon_id
├── cli_name              # 'claude' | 'codex' | ...
├── version
├── capabilities          # JSONB — declared feature set
├── last_seen
└── status

task
├── id
├── required_capabilities # JSONB — what the task needs
├── preferred_runtime_id  # optional
└── ...
```

## Tradeoffs

- Non-determinism — same task on different machines may run on different models
- Debugging gets harder — "why did this task produce different output?" → check which CLI ran it
- Mitigate with: log `runtime_id` on every task execution; include in activity_log

## When to apply

- Any platform building on CLI-based coding agents
- Apps where user preferences around LLM providers matter
- Teams where different members have access to different models

## When to avoid

- Apps requiring strict reproducibility (regulated verification workflows)
- When you need provider-specific features not abstracted by the CLI layer
- When licensing/compliance requires a single approved provider

## Source

Multica: CLI detection in daemon startup (`server/cmd/multica/cmd_daemon*.go`), runtime registration in `server/internal/handler/daemon.go`.
