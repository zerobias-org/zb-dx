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

# [EXAMPLE] Auth token refresh fails silently when offline

> Fictional example for tutorial purposes. Not a real issue.

## What I was trying to do

Build a long-running workflow in SME Mart that gracefully handles network drops — users might be on spotty wifi during a vetting interview.

## What happened

When the network dropped for longer than 30 seconds, the zerobias-client auth token refresh failed silently. Subsequent API calls came back with `401 Unauthorized` but the client didn't emit any event or error — it just returned empty responses. Took me an hour of logging to figure out what was going on.

## What I expected

An error event or observable I can subscribe to so I can re-auth the user or prompt them to reconnect.

## Workaround (if any)

Polling a `/health` endpoint every 10s and manually calling `client.refreshToken()` on failure. Ugly and wastes bandwidth, but it works.
