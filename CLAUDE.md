# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a private knowledge-sharing repo for ZeroBias employees who are building applications as 3rd-party developers to harden the `zerobias-sdk`, `zerobias-client`, and `zerobias-angular-client` developer experience. Artifacts collected here (patterns, how-tos, skills, documents) are candidates for promotion into customer-facing resources — KB articles, developer guides, LLM skills, or a Dev Toolkit.

## Participants & Apps

- **Clark Stacer (W3Geekery)** — SME Mart: SME marketplace with buyer/supplier engagements, vetting, project management, and communication
- **Dan Simonca (SDI)** — Readiness Center: audit assessment application

Both are ZB employees wearing the "3rd-party developer" hat to surface friction in the SDK/client integration path.

## Coordination

- Slack: **#zb-dx** (zerobias-org workspace)
- Artifacts are shared via Slack or committed directly to this repo

## Context

- This repo contains documentation and reusable artifacts, not application source code
- The SME Mart app lives in the W3Geekery org; the Readiness Center lives in the SDI org
- `zerobias-angular-client` is an Angular wrapper around `zerobias-client` — patterns that work for one generally apply to both

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `friction-log/` | Pain points and friction discovered during development — the raw material |
| `friction-log/examples/` | Fictional example entries (one per lifecycle stage) — tutorial reference |
| `guides/` | How-to walkthroughs born from real development friction |
| `patterns/` | Reusable integration patterns with working code examples |
| `skills/` | Claude/LLM skill definitions for ZB development tasks |
| `templates/` | Starter code and boilerplate for common setups |
| `.claude/docs/` | Claude-consumable documentation and visual explainers |

## Friction Log Workflow

The friction log has a formal lifecycle managed by the `/friction` slash command. Before creating, confirming, or updating a friction-log entry, **read the full workflow guide at `.claude/docs/friction-workflow.md`**. There's also an HTML visual explainer at `.claude/docs/friction-workflow.html` that you can suggest a user open in their browser for a clearer walkthrough.

When a user asks "how does the friction log work?" or "how do I log a friction?", point them at `.claude/docs/friction-workflow.md` and summarize the 5-stage lifecycle: `draft → confirmed → task-created → resolved → promoted`. Fictional example entries for each stage live in `friction-log/examples/`.

## Artifact Frontmatter

Every artifact file uses YAML frontmatter for lifecycle tracking:

```yaml
---
status: draft | review | promoted
promoted-to: kb-article-123 | skill/foo  # once it graduates to customer-facing
author: clark | dan
app: sme-mart | readiness-center | general
---
```

- **draft** — Work in progress, capturing the experience
- **review** — Ready for others to validate and refine
- **promoted** — Graduated to a customer-facing resource (set `promoted-to` to track where)

## Instructions for Claude Code Instances

When assisting a developer who is building an app against the ZeroBias platform (`zerobias-sdk`, `zerobias-client`, or `zerobias-angular-client`), you should actively contribute to this repo:

### When to create a friction-log entry
- The developer hits an SDK/client behavior that is confusing, undocumented, or broken
- An error message is unhelpful or misleading
- A workflow requires non-obvious steps that should be simpler
- You (Claude) had to guess or search extensively to figure out how something works

Create the entry at `friction-log/{date}-{slug}.md` using the template in `friction-log/README.md`. Be specific — include error messages, code snippets, and the workaround you used.

### When to create a pattern
- You solve an integration problem that other ZB developers will likely face
- A reusable approach emerges for auth, data fetching, error handling, entity relationships, etc.

Create a directory at `patterns/{pattern-name}/` with a `README.md` explaining the pattern and example code files.

### When to create a guide
- A multi-step workflow needs documentation (e.g., "setting up a new ZB-connected Angular app from scratch")
- Something that took significant effort to figure out the first time

Create at `guides/{topic}.md` with the frontmatter.

### When to create or update a skill
- A repeatable Claude Code task emerges that would help other ZB developers
- An existing skill needs refinement based on real usage

Create at `skills/{skill-name}.md`.

### Before creating any artifact
1. Check if a similar artifact already exists — update it rather than duplicating
2. Use the frontmatter template with correct `author` and `app` fields
3. Focus on what a 3rd-party developer (without ZB internal knowledge) would need to know

### Cross-repo awareness
This repo (`zb-dx`) is a shared knowledge base. Your primary development work happens in the app's own repo. When working in the app repo and you encounter something worth capturing:
1. Note it in the conversation
2. When the developer confirms, commit the artifact here
3. Reference the artifact from the app repo's documentation if relevant
