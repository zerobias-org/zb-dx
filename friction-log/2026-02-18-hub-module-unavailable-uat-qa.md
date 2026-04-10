---
status: draft
author: clark
app: sme-mart
severity: medium
subscribers:
  - clark
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# Hub Module unavailable on UAT/QA environments

## What I was trying to do

Use the Hub Module connector for data operations (the intended production architecture) during development and testing on UAT and QA environments.

## What happened

Hub Module connector is not active on UAT or QA. All pre-prod environments are forced to use direct Neon HTTP as a fallback (`dbMode: 'neon'`). Only production has `dbMode: 'hub'`.

This means:
- Development workflow diverges significantly from production
- Bugs specific to Hub Module integration can only be caught in production
- Edge Middleware has to inject API credentials server-side to compensate

## What I expected

Hub Module to be available on at least UAT so the full production path can be tested before deploying.

## Workaround (if any)

Environment-specific `dbMode` toggle:

| Environment | dbMode | Notes |
|---|---|---|
| development | `neon` | Direct Neon HTTP |
| QA | `neon` | Hub not active |
| UAT | `neon` | Hub not active |
| Vercel preview | `neon` | Edge Middleware credential injection |
| Production | `hub` | Hub Module active |

The database service layer abstracts the mode switch, but it means we're testing a fundamentally different data path in pre-prod vs prod.
