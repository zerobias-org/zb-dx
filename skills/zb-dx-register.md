---
description: Register yourself as a participant in the zb-dx knowledge base. Creates a participant profile in the zb-dx repo and posts a welcome note to #zb-dx Slack.
---

# /zb-dx-register

Self-registration for developers contributing to the `zb-dx` knowledge base. Run this once when you join the `#zb-dx` Slack channel.

## What it does

1. Reads `~/.claude/zb-dx.json` for the repo path (same config used by `/friction`)
2. Pulls your Slack profile via the Slack MCP (name, handle, avatar, email if available)
3. Prompts for missing info (org, app you're building, focus area, GitHub username)
4. Creates `participants/{firstname-lastname}.md` in the zb-dx repo with frontmatter
5. Commits to `main` (matches `/friction` workflow — no PR needed)
6. Offers to post a welcome intro message to `#zb-dx` (channel ID: `C0ARM97HBK2`)
7. Points the new participant at `IDEAS.md`, `friction-log/`, and the `/friction` skill

## Config required

`~/.claude/zb-dx.json`:
```json
{
  "repo_path": "/absolute/path/to/zb-dx",
  "author": "your-slug"
}
```

If `zb-dx.json` doesn't exist yet, offer to create it as part of the flow.

## Slug convention

`firstname-lastname` lowercase (e.g. `joe-llamas`). This matches the `author` field on friction-log entries and other artifacts.

## Participant file format

```yaml
---
name: {full name}
org: {org or team}
slack: "@{handle}"
github: {username}
app: {app name being built on ZB}
focus: {area of focus}
joined: {YYYY-MM-DD}
---

# {Full Name}

{one-paragraph bio — what they're building, their background}
```

## Subcommands

- `/zb-dx-register` — register yourself (default, interactive)
- `/zb-dx-register list` — show all current participants (reads `participants/*.md`)
- `/zb-dx-register sync` — compare `#zb-dx` Slack channel members to `participants/` and list anyone missing a profile
- `/zb-dx-register update` — update your existing profile (bio, app, focus, etc.)

## Welcome message template

When posting to `#zb-dx` after registration:

```
👋 Welcome {name} from {org}!

They're building **{app}** focused on {focus}.

Quick links to get started:
• `IDEAS.md` — things worth building: https://github.com/zerobias-org/zb-dx/blob/main/IDEAS.md
• `/friction` skill — capture SDK/client pain points: https://github.com/zerobias-org/zb-dx/blob/main/skills/friction.md
• `friction-log/` — see what others have hit
• `patterns/` & `guides/` — reusable solutions
```

## Implementation notes

- Use the Slack MCP (`mcp__claude_ai_Slack__*`) to fetch user profile and post the welcome message
- Fall back to manual prompts if Slack MCP isn't available
- Commit message format: `feat(participants): add {name} profile`
- Include `Session: claude --resume zb-dx` in the commit body
- Skip the Slack post if user declines — just do the commit
- For `sync` subcommand: call `slack_search_users` or read channel members from `C0ARM97HBK2`, diff against `participants/*.md` frontmatter

## Gotchas

- `#zb-dx` is a **private** channel — Slack MCP must have access
- If GitHub username isn't known, save as `TBD` and prompt later
- Don't overwrite an existing participant file without confirmation
- Respect the `author` field in `zb-dx.json` — if it's already set and matches an existing participant, offer to `update` instead of creating new
