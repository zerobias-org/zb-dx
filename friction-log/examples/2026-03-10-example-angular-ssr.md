---
status: promoted
author: clark
app: sme-mart
severity: high
subscribers:
  - clark
zb-task: TASK-4100
resolution: "zerobias-angular-client v3.1 added `provideZerobiasSSR()` for automatic state transfer between server and client"
resolved-date: 2026-03-05
promoted-to: guides/angular-ssr-setup.md
---

# [EXAMPLE] Angular SSR hydration mismatch with zerobias-angular-client

> Fictional example for tutorial purposes. Not a real issue.

## What I was trying to do

Enable server-side rendering in SME Mart for better SEO on public supplier profiles.

## What happened

After enabling SSR, zerobias-angular-client initialized twice — once on the server, once on the client — leading to hydration mismatches and duplicate API calls. Console flooded with `NG0500: Hydration Mismatch` errors.

## What I expected

Either SSR support out of the box, or clear docs on how to set it up.

## Workaround (if any)

Wrapping all ZB calls in `afterNextRender()`. Works but defeats the entire purpose of SSR for ZB-backed content.

## ZB Platform Task

- **Task:** [TASK-4100](https://app.zerobias.com/tasks/TASK-4100)
- **Title:** `feat: SSR support for zerobias-angular-client`
- **Created:** 2026-02-25
- **Created by:** clark

## Resolution (2026-03-05)

Shipped in **zerobias-angular-client v3.1** with a new `provideZerobiasSSR()` provider. Handles state transfer automatically:

```ts
import { provideZerobiasSSR } from '@zerobias/angular-client/ssr';

bootstrapApplication(AppComponent, {
  providers: [
    provideZerobiasClient({ orgId, environment }),
    provideZerobiasSSR(),
  ],
});
```

## Promoted (2026-04-01)

Graduated into **`guides/angular-ssr-setup.md`** — a full walkthrough showing how to set up SSR with zerobias-angular-client from scratch, including gotchas around state transfer and API call deduplication. Also queued for a customer-facing KB article.
