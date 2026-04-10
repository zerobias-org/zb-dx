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

# KB articles stored in CDN require auth credentials to load

## What I was trying to do

Load knowledge base article content from the ZeroBias CDN to display within the SME Mart app (e.g., help content, onboarding guides).

## What happened

KB articles hosted on the CDN require authentication credentials to access, but there's no mechanism to pass credentials when loading CDN-hosted content. The GQL schema for KB articles was published to prod, but the actual content fetch fails without auth.

Discovered 2026-03-17 during integration testing.

## What I expected

Either:
1. Public KB articles to be accessible without auth (they're knowledge base content, not sensitive data), or
2. A documented auth flow for CDN content that works with the existing session/token model

## Workaround (if any)

None yet. KB article integration is deferred until this is resolved.
