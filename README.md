# zb-dx

A shared knowledge base for **any developer** building on the ZeroBias platform — `zerobias-sdk`, `zerobias-client`, and `zerobias-angular-client`. Patterns, guides, skills, and friction logs contributed by the community of developers using the platform.

## Purpose

Developers building real applications against the ZeroBias platform hit friction, discover patterns, and figure out non-obvious solutions. This repo is where those discoveries get captured as reusable artifacts — so the next developer doesn't have to solve the same problem twice.

Contributors include ZeroBias team members dogfooding the SDK and external developers shipping production apps. The best artifacts graduate into customer-facing resources: KB articles, developer guides, Claude/LLM skills, and a future Dev Toolkit.

## Who Contributes

Anyone building on the ZeroBias platform:
- **ZeroBias team members** dogfooding as 3rd-party developers
- **Partner & customer developers** integrating with the platform
- **Claude Code / AI assistants** capturing friction and patterns during real development sessions

## Current Participants

| Developer | Org | Application | Focus |
|-----------|-----|-------------|-------|
| [Clark Stacer](./participants/clark-stacer.md) | W3Geekery | **SME Mart** — SME marketplace (buyer/supplier engagements, vetting, project management, comms) | Angular client, full-stack patterns |
| [Dan Simonca](./participants/dan-simonca.md) | SDI | **Readiness Center** — Audit assessment application | SDK integration patterns |
| [Joe Llamas](./participants/joe-llamas.md) | Work Worlds | _TBD_ | Partner app development with zerobias-sdk / zerobias-client |

Each participant has a profile in [`participants/`](./participants/). New devs can self-register with the **`/zb-dx-register`** slash command after joining `#zb-dx` on Slack.

## What Lives Here

- **Patterns** — Reusable integration patterns for the ZB SDK/client
- **How-tos** — Step-by-step guides born from real development friction
- **Skills** — Claude/LLM skill definitions for common ZB development tasks
- **Documents** — Architecture notes, decision records, and reference material

## Got an Idea?

See **[IDEAS.md](./IDEAS.md)** — a running list of patterns, guides, skills, and tools worth building. Add your own, check off what you build, or just browse for inspiration.

## Communication

Slack: **#zb-dx** (zerobias-org workspace)

## ZeroBias SDK Stack

- **`zerobias-sdk`** — Core SDK for the ZeroBias platform
- **`zerobias-client`** — Client library built on the SDK
- **`zerobias-angular-client`** — Angular wrapper around `zerobias-client`
