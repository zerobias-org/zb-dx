---
status: confirmed
author: clark
app: sme-mart
severity: medium
subscribers:
  - clark
  - dan
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# [EXAMPLE] Entity search pagination returns off-by-one totalCount

> Fictional example for tutorial purposes. Not a real issue.

## What I was trying to do

Display "Showing 20 of 247 suppliers" with a paginated list in SME Mart.

## What happened

The `totalCount` field returned by `searchEntities()` was off by one compared to the actual result count when using `pageSize=20`. Total said 247, but paginating through all pages only yielded 246 results.

## What I expected

`totalCount` to exactly match the number of results I'd get by walking all pages.

## Workaround (if any)

Calling `searchEntities()` once with a huge `pageSize` to get the real count, then re-fetching with normal pagination. Wastes a round-trip on every page load.

## Confirmed by dan (2026-03-21)

**App:** readiness-center

Hit the same thing when listing assessment templates. My `totalCount` was off by **2** with `pageSize=50`. I wonder if it's related to soft-deleted entities being counted but not returned.

**Workaround:** Just showing "20+" instead of an exact count. Not great UX but avoids the phantom-entity problem.
