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

# Catalog endpoints have inconsistent search and pagination

## What I was trying to do

Build a unified catalog search for the SME Mart provider directory that queries multiple ZeroBias catalog endpoints.

## What happened

Different catalog endpoints behave inconsistently:
- Some return raw arrays, others return paged objects with `items` property
- Server-side search (`?search=term`) is not consistently supported across endpoints
- Pagination parameters vary between endpoints

Had to build a normalization layer in the API proxy route to handle all variants.

## What I expected

Consistent API contract across catalog endpoints: same pagination format, same search parameter support, same response envelope.

## Workaround (if any)

Normalization logic in the Next.js API route:

```typescript
// Normalize response (some endpoints return array, some return paged object)
let items: CatalogItem[] = [];
if (Array.isArray(data)) {
  items = data;
} else if (data.items) {
  items = data.items;
}

// Client-side search filter (ZeroBias doesn't always support server-side search)
if (search) {
  const searchLower = search.toLowerCase();
  items = items.filter(item =>
    item.name?.toLowerCase().includes(searchLower) ||
    item.code?.toLowerCase().includes(searchLower) ||
    item.description?.toLowerCase().includes(searchLower)
  );
}
```

Every app that consumes catalog data will need to implement similar normalization.
