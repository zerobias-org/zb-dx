---
status: draft
author: clark
app: sme-mart
severity: low
subscribers:
  - clark
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# Admin status check via Dana SDK fails silently

## What I was trying to do

Check if the current user is an org admin via `danaClient.getOrgApi().getRequestOrgMember(userId)` to conditionally show admin-only UI features.

## What happened

The call intermittently throws errors with no useful error message. Since admin status is optional for core functionality, the error is swallowed with a `console.warn` and the user defaults to non-admin.

The user has no indication that their privilege check may have failed — they might actually be an admin but see a non-admin view.

## What I expected

Either a reliable endpoint, or a clear error code that distinguishes "not an admin" from "API error" so the app can display an appropriate message.

## Workaround (if any)

```typescript
try {
  const orgMember = await appService.zerobiasClientApi.danaClient
    .getOrgApi()
    .getRequestOrgMember(userData.id);
  setIsAdmin(!!orgMember.admin);
} catch (err) {
  console.warn('Failed to check admin status:', err);
  setIsAdmin(false); // Graceful fallback — may hide admin features from actual admins
}
```
