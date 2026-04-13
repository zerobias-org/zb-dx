# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a shared knowledge-sharing repo for **any developer** building on the ZeroBias platform — `zerobias-sdk`, `zerobias-client`, and `zerobias-angular-client`. Artifacts collected here (patterns, how-tos, skills, documents) are candidates for promotion into customer-facing resources — KB articles, developer guides, LLM skills, or a Dev Toolkit.

Contributors include ZeroBias team members dogfooding the SDK, external partners, and customer developers shipping production apps. The public repo means anyone can fork, contribute a pattern, or capture friction they hit.

## Participants & Apps

Each contributing developer has a profile in [`participants/`](./participants/) as `{firstname-lastname}.md` with frontmatter (`name`, `org`, `slack`, `github`, `app`, `focus`, `joined`). The `participants/README.md` explains the format.

Current active participants:

- **Clark Stacer (W3Geekery)** — SME Mart
- **Dan Simonca (SDI)** — Readiness Center
- **Joe Llamas (Work Worlds)** — Partner app development

New devs should run **`/zb-dx-register`** after joining `#zb-dx` on Slack. The skill pulls their Slack profile, prompts for missing info, commits a participant file, and optionally posts a welcome message in `#zb-dx`. Subcommands: `list`, `sync` (diffs Slack channel members vs `participants/`), `update`.

When a user asks "how do I register?" or "how do I join zb-dx?", point them at the `/zb-dx-register` skill. If the user mentions they've just joined `#zb-dx` but haven't registered, suggest running it.

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
| `participants/` | One MD file per contributing developer (profile + bio) |
| `.claude/docs/` | Claude-consumable documentation and visual explainers |
| `IDEAS.md` | Running list of patterns/guides/skills/tools worth building — open for any contributor to add to |

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

### When to suggest IDEAS.md
- The developer expresses interest in contributing but doesn't know where to start
- You (Claude) identify a reusable tool/pattern/guide that doesn't fit an existing artifact type yet
- A conversation surfaces multiple ideas that can't all be built right now

`IDEAS.md` is the parking lot — add entries under the appropriate section (Patterns / Guides / Skills / Templates / Notes / Meta). Check off items when they graduate to real artifacts.

### When to suggest `/zb-dx-register`
- A new developer is working on a ZeroBias platform app for the first time and hasn't been added to `participants/`
- The user mentions being added to the `#zb-dx` Slack channel
- You notice the user's `author` slug in `zb-dx.json` doesn't match any file in `participants/`

### Config
The `/friction` and `/zb-dx-register` skills both read `~/.claude/zb-dx.json`:
```json
{
  "repo_path": "/absolute/path/to/zb-dx",
  "author": "firstname-lastname"
}
```

The `author` slug should match a file in `participants/` (e.g., `author: clark-stacer` ↔ `participants/clark-stacer.md`).

### Cross-repo awareness
This repo (`zb-dx`) is a shared knowledge base. Your primary development work happens in the app's own repo. When working in the app repo and you encounter something worth capturing:
1. Note it in the conversation
2. When the developer confirms, commit the artifact here
3. Reference the artifact from the app repo's documentation if relevant
