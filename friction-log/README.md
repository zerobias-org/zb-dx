# Friction Log

Raw pain points discovered while building apps against the ZeroBias SDK/client stack. Every entry here is a candidate for improving the developer experience.

## File Naming

`{date}-{slug}.md` — e.g., `2026-04-08-client-auth-refresh.md`

## Lifecycle

```
draft → confirmed → task-created → resolved → promoted
```

| Status | Meaning |
|--------|---------|
| `draft` | One developer logged a pain point |
| `confirmed` | Another developer experienced the same issue |
| `task-created` | Escalated to a ZB platform task (feature request or bug) |
| `resolved` | The fix has shipped or a decision was made |
| `promoted` | Extracted into a customer-facing resource (KB article, guide, skill, etc.) |

## Template

```markdown
---
status: draft
author: clark
app: sme-mart
severity: high
subscribers:
  - clark
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# {Short title}

## What I was trying to do

## What happened

## What I expected

## Workaround (if any)
```

## Severity Levels

- **critical** — Blocked development, no workaround
- **high** — Significant friction, workaround exists but painful
- **medium** — Confusing or undocumented, figured it out eventually
- **low** — Minor annoyance, nice-to-have improvement

## Managing Entries

Use the `/friction` slash command (see `skills/friction.md`):

```
/friction new Client auth token refresh fails silently -s high -a sme-mart
/friction confirm client-auth-refresh
/friction task client-auth-refresh --notify
/friction resolve client-auth-refresh
/friction list
/friction check
```

Install with `./install.sh` from the repo root.
