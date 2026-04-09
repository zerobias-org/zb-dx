---
status: resolved
author: clark
app: sme-mart
severity: medium
subscribers:
  - clark
zb-task: TASK-4321
resolution: "Added configurable `connectionTimeoutMs` option in zerobias-client v2.4.1, default bumped from 5s to 15s"
resolved-date: 2026-03-30
promoted-to: null
---

# [EXAMPLE] Hardcoded 5s connection timeout breaks slow networks

> Fictional example for tutorial purposes. Not a real issue.

## What I was trying to do

Connect to the ZB platform from a mobile SME Mart app on a slow cellular network.

## What happened

zerobias-client would throw `ConnectionTimeout` after exactly 5 seconds with no way to override. Worked fine on wifi, failed consistently on 3G.

## What I expected

A configurable timeout, or at least a longer default for flaky networks.

## Workaround (if any)

None — had to tell field users to use wifi.

## ZB Platform Task

- **Task:** [TASK-4321](https://app.zerobias.com/tasks/TASK-4321)
- **Title:** `feat: Make zerobias-client connection timeout configurable`
- **Created:** 2026-03-18
- **Created by:** clark

## Resolution (2026-03-30)

Shipped in **zerobias-client v2.4.1**. New `connectionTimeoutMs` option:

```ts
const client = new ZerobiasClient({
  connectionTimeoutMs: 30000, // 30s for very slow networks
});
```

Backward compatible — if not specified, new default is **15000ms** (was 5000ms). Docs updated at `docs.zerobias.com/client/config#timeouts`.
