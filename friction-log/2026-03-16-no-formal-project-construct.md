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

# No formal project construct in ZeroBias platform

## What I was trying to do

Organize engagements, RFPs, task boards, and boundaries under a "project" container — the natural grouping for marketplace work between buyers and providers.

## What happened

The ZeroBias platform does not yet have a formal project construct. There's no API for creating, listing, or managing projects as first-class entities.

This was first identified 2026-03-13. As of 2026-03-24, internal stakeholders (Catalina) also flagged urgency: "we need it now."

## What I expected

A platform-level project entity that can contain multiple boundaries, task boards, and participants — with API support for CRUD operations.

## Workaround (if any)

Using tags as generic containers for projects. SME Mart manages its own project model in the GQL schema (`SmeMartProject`) backed by Neon/Pipeline, rather than using a platform-native construct.

This means:
- Project management logic lives in the app, not the platform
- No cross-app project interoperability
- When the platform project construct ships, a migration will be needed
- Other third-party apps will each reinvent their own project container
