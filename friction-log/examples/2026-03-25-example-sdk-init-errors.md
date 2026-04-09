---
status: task-created
author: dan
app: readiness-center
severity: high
subscribers:
  - dan
  - clark
zb-task: TASK-4567
resolution: null
resolved-date: null
promoted-to: null
---

# [EXAMPLE] SDK init error messages are unhelpful

> Fictional example for tutorial purposes. Not a real issue.

## What I was trying to do

Initialize zerobias-sdk in a new Node.js worker with custom credentials.

## What happened

When I passed bad credentials (missing `orgId`), the SDK threw:

```
Error: Cannot read property 'length' of undefined
    at e.t.init (minified.bundle.js:1:45821)
    ...
```

Stack trace pointed into minified SDK internals. No indication that `orgId` was missing.

## What I expected

Something like:
```
ZerobiasSDKError: Missing required config field 'orgId'.
See https://docs.zerobias.com/sdk#config for required fields.
```

## Workaround (if any)

Carefully re-reading every SDK docs page until I found the `orgId` requirement buried in a footnote.

## Confirmed by clark (2026-03-23)

**App:** sme-mart

I hit this too when I forgot to set `environment: 'staging'` — got `undefined.pipe is not a function`. Spent an hour thinking it was an RxJS bug in my code.

**Workaround:** Same — trial and error with the docs.

## ZB Platform Task

- **Task:** [TASK-4567](https://app.zerobias.com/tasks/TASK-4567)
- **Title:** `feat: Add config validation to SDK init with clear error messages`
- **Created:** 2026-03-25
- **Created by:** dan
- **Subscribers:** dan, clark
