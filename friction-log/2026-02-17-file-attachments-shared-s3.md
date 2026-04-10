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

# File attachments upload to shared S3 bucket with no scoping

## What I was trying to do

Upload vendor documents (proposals, certifications, compliance artifacts) as file attachments within SME Mart, expecting them to be scoped to the uploading org or boundary.

## What happened

File attachments go to a shared AWS S3 bucket with no per-org or per-boundary scoping. Any authenticated user could potentially access files uploaded by other organizations.

Discovered 2026-02-20 when testing the vendor file upload flow as a w3geekery vendor.

## What I expected

File storage scoped to the uploading org or boundary, with access controlled by the same RBAC that governs the rest of the platform. Sensitive vendor documents (financials, compliance certs, PII) should not be accessible to unrelated parties.

## Workaround (if any)

None yet. For now, advising users not to upload highly sensitive documents through the platform attachment mechanism. Document sharing features in SME Mart are stub implementations pending a scoped storage solution.
