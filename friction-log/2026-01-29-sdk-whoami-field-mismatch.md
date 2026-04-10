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

# SDK whoAmI() response field names don't match docs

## What I was trying to do

Authenticate and display the current user's name and email after calling `whoAmI()` via the ZeroBias client SDK.

## What happened

The response object uses different field names than expected:
- `name` instead of `displayName`
- `emails` (array of objects) instead of `email` (string)

TypeScript types didn't match the actual runtime response, so the app showed "undefined" for user name and email until we cast to `any` and added fallback chains.

## What I expected

Either the SDK types match the actual API response, or the docs clearly state the field mapping. A `displayName` field and a top-level `email` string would be the intuitive API.

## Workaround (if any)

Cast the response to `any` and use defensive fallback chains:

```typescript
const name = userData.name || userData.displayName || email;
const email = userData.emails?.[0]?.address || userData.email || 'unknown';
```

This was discovered during initial auth integration and fixed in commit `4cea2a7`.
