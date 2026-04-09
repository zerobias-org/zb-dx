# Friction Log Manager

Manage the ZB 3rd-party developer friction log — create, confirm, escalate to ZB tasks, resolve, and track.

## Self-Correction Rule

**IMPORTANT:** If any MCP call or file operation in this command fails, DO NOT just report the error. Instead:
1. Fix the issue and retry
2. After success, **update this skill file** to correct the bad instruction
3. Add a note in the "Changelog" section at the bottom

## Configuration

The repo path is stored in `~/.claude/zb-poc-devs.json`:
```json
{
  "repo_path": "/path/to/zb-poc-devs",
  "author": "clark"
}
```

Read this config at the start of every invocation. If missing, tell the user to run the install script.

## No-Args Behavior

If invoked with NO arguments (just `/friction` and nothing else), display the usage summary below and STOP.

````
## `/friction` Usage

```
/friction <subcommand> [args] [flags]
```

### Subcommands
| Command | Description |
|---------|-------------|
| `new [title]` | Create a new friction-log entry (interactive if no title) |
| `confirm <slug>` | Add your experience to an existing entry, bump to confirmed |
| `task <slug>` | Create a ZB platform task and link it to the entry |
| `resolve <slug>` | Mark as resolved with resolution details |
| `promote <slug>` | Mark as promoted, record where it graduated to |
| `list [status]` | List entries, optionally filtered by status |
| `check` | Query ZB MCP for status updates on all task-created entries |

### Flags
| Flag | Description |
|------|-------------|
| `--severity` / `-s` | `critical`, `high`, `medium`, `low` (default: `medium`) |
| `--app` / `-a` | `sme-mart`, `readiness-center`, `general` |
| `--notify` / `-n` | Post update to #zb-poc-devs Slack channel |

### Examples
```
/friction new Client auth token refresh fails silently -s high -a sme-mart
/friction confirm client-auth-refresh
/friction task client-auth-refresh --notify
/friction resolve client-auth-refresh
/friction list task-created
/friction check
```
````

## Subcommand Details

### `new [title]`

1. Read config from `~/.claude/zb-poc-devs.json`
2. If no title provided, ask the user:
   - What were you trying to do?
   - What happened?
   - What did you expect?
   - Severity?
3. Generate a slug from the title (lowercase, hyphens, no special chars)
4. Generate today's date in YYYY-MM-DD format
5. Create the file at `{repo_path}/friction-log/{date}-{slug}.md`:

```markdown
---
status: draft
author: {author from config}
app: {from --app flag or ask}
severity: {from --severity flag or ask}
subscribers:
  - {author}
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# {Title}

## What I was trying to do

{user's description}

## What happened

{user's description}

## What I expected

{user's description}

## Workaround (if any)

{user's description or "None yet."}
```

6. Stage and commit the file: `chore(friction): log {slug}`
7. Report the file path and slug to the user

### `confirm <slug>`

1. Read config from `~/.claude/zb-poc-devs.json`
2. Find the friction-log file matching the slug (partial match OK — search `{repo_path}/friction-log/` for files containing the slug)
3. Read the file
4. Ask the user for their experience:
   - What happened in your case?
   - Do you have a workaround?
5. Add the author from config to `subscribers` if not already present
6. Append a new section to the file:

```markdown
## Confirmed by {author} ({date})

**App:** {their app}

{their experience description}

**Workaround:** {their workaround or "Same as above."}
```

7. Update `status` to `confirmed` (if currently `draft`)
8. Commit: `chore(friction): confirm {slug} by {author}`
9. If `--notify` flag or severity is `critical`/`high`, post to `#zb-poc-devs` Slack (channel ID: `C0ARM97HBK2`):
   > Friction confirmed by multiple devs: **{title}** — `friction-log/{filename}`

### `task <slug>`

1. Read config and find the friction-log file
2. Read the full entry to understand the issue
3. Create a ZB platform task using the ZeroBias MCP tools:
   - Use the `zerobias_execute` MCP tool to create the task
   - Type: `feat:` (feature request) or `bug:` (bug report) based on the entry
   - Title: derived from the friction-log title
   - Description: summarize the friction-log entry with a link to the file in the GitHub repo (`https://github.com/zerobias-org/zb-poc-devs/blob/main/friction-log/{filename}`)
   - Include subscribers as notify list
4. Update the friction-log frontmatter:
   - Set `status: task-created`
   - Set `zb-task:` to the created task ID/slug
5. Append a section:

```markdown
## ZB Platform Task

- **Task:** {task ID/link}
- **Created:** {date}
- **Created by:** {author}
- **Subscribers:** {list}
```

6. Commit: `chore(friction): create task for {slug}`
7. If `--notify` flag, post to `#zb-poc-devs` Slack:
   > ZB task created for friction: **{title}** — Task: {task ID}

### `resolve <slug>`

1. Read config and find the friction-log file
2. Ask the user:
   - What was the resolution? (PR link, SDK version, config change, etc.)
   - Is there a guide or pattern worth extracting? (suggest creating one)
3. Update frontmatter:
   - Set `status: resolved`
   - Set `resolution:` to the summary
   - Set `resolved-date:` to today
4. Append a section:

```markdown
## Resolution ({date})

{resolution details}
```

5. Commit: `chore(friction): resolve {slug}`
6. Post to `#zb-poc-devs` Slack, @-mentioning all subscribers:
   > Friction resolved: **{title}** — {one-line resolution summary}
7. If the user wants to extract a guide/pattern, suggest `/friction promote {slug}` next

### `promote <slug>`

1. Read config and find the friction-log file
2. Ask the user where it's being promoted to (KB article, guide, pattern, skill, SDK changelog, etc.)
3. Update frontmatter:
   - Set `status: promoted`
   - Set `promoted-to:` to the destination
4. Commit: `chore(friction): promote {slug} to {destination}`

### `list [status]`

1. Read config
2. Scan all `.md` files directly in `{repo_path}/friction-log/` (do NOT recurse — skip `examples/` and `README.md`)
3. Parse frontmatter from each file
4. Display as a table:

```
| Status       | Severity | Slug                    | App             | Subscribers  |
|--------------|----------|-------------------------|-----------------|--------------|
| task-created | high     | client-auth-refresh     | sme-mart        | clark, dan   |
| confirmed    | medium   | entity-search-pagination| readiness-center| dan          |
| draft        | low      | unclear-error-codes     | general         | clark        |
```

If a status filter is provided, only show entries with that status.

### `check`

1. Read config
2. Scan only direct `.md` files in `{repo_path}/friction-log/` (skip `examples/` and `README.md`) — find entries with `status: task-created` and a `zb-task` value
3. For each, query the ZB platform via MCP for the current task status
4. Report a summary:

```
| Friction Entry           | ZB Task    | Task Status | Last Updated |
|--------------------------|------------|-------------|--------------|
| client-auth-refresh      | TASK-1234  | in-progress | 2026-04-05   |
| entity-search-pagination | TASK-1240  | completed   | 2026-04-08   |
```

5. For any task that has moved to `completed`:
   - Ask the user if they want to resolve the friction-log entry
   - If yes, run the `resolve` flow
6. If `--notify` flag, post the summary to `#zb-poc-devs`

## Git Behavior

- Always `git pull` the repo before making changes (to avoid conflicts with the other developer)
- Always commit and push after changes
- Commit messages use format: `chore(friction): {action} {slug}`

## Slack Integration

- Channel: `#zb-poc-devs` (ID: `C0ARM97HBK2`)
- Use Slack MCP tools for posting
- @-mention subscribers by looking up their Slack user IDs:
  - clark: `U08GK48MHFC`
  - dan: `U087STEAQ5C`
- When new developers join, their Slack IDs should be added to this mapping

## Changelog

Log all changes — both self-corrections and manual improvements. Format:

```
- YYYY-MM-DD: Description (author, type)
```

Types: `self-correction` (Claude fixed a failing operation), `manual` (human improvement)

- 2026-04-09: Added tutorial examples in `friction-log/examples/` and workflow guide at `.claude/docs/friction-workflow.md`. `list` and `check` now explicitly skip the `examples/` subfolder. (clark, manual)
