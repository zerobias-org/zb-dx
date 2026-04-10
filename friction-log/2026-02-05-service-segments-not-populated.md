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

# Service segments not populated in catalog

## What I was trying to do

Query the ZeroBias catalog for service segments to build the SME Mart provider directory — the natural approach for a marketplace that categorizes SME services.

## What happened

The intended endpoint (`/api/platform/catalog/segments?pageSize=X` with an `isService` filter) returns empty results because service segments haven't been populated in the catalog yet.

## What I expected

Service segments to be available in the catalog, or clear documentation stating they aren't available yet and suggesting the alternative approach.

## Workaround (if any)

Using the tags API with `tagTypes=service-segment` instead:

```typescript
// TODO: Once ZeroBias service segments are populated, switch to the segment list
// endpoint with isService filter. Check periodically if segments have been updated.
url = `${ZEROBIAS_HOST}/api/platform/tags?tagTypes=service-segment&pageSize=${pageSize}`;
```

This works but is semantically wrong — tags and segments are different concepts. The workaround means we need to monitor for when segments are populated and migrate.
