# automation

Background jobs run by GitHub Actions for the `zb-dx` repo.

## zb-dx-watcher

Polls the `#zb-dx` Slack channel hourly during working hours (Central + Pacific, Mon-Fri) and sends Clark a DM with a draft welcome message whenever a new member joins.

**Workflow:** [`.github/workflows/zb-dx-watcher.yml`](../.github/workflows/zb-dx-watcher.yml)
**Script:** [`poll.mjs`](./poll.mjs)
**Welcome template:** [`welcome-template.md`](./welcome-template.md)
**State:** [`known-members.json`](./known-members.json) — auto-managed; do not edit by hand

### Behavior

1. Fetch current `#zb-dx` channel members via Slack API
2. Diff against `known-members.json`
3. For each new (human) member:
   - Fetch their profile (name, email if visible, title)
   - Render the welcome template with their first name
   - DM Clark with a draft, formatted for copy/paste
4. Update `known-members.json` and commit if changed

**First run is a silent bootstrap** — captures current members as the baseline; no welcomes go out for people already in the channel. Subsequent runs only DM Clark about *new* arrivals.

### Required GitHub repo secret

- `SLACK_BOT_TOKEN` — bot user OAuth token (`xoxb-...`) from the `zb-dx-watcher` Slack app

### Required Slack bot scopes

- `groups:read` — read private channel members
- `users:read`, `users:read.email` — fetch profiles
- `chat:write`, `im:write` — DM Clark

### Test it manually

```bash
gh workflow run zb-dx-watcher.yml --repo zerobias-org/zb-dx
gh run watch --repo zerobias-org/zb-dx
```

### Editing the welcome message

Just edit [`welcome-template.md`](./welcome-template.md) and commit. Variables:
- `{{first_name}}` — recipient's first name
- `{{handle}}` — their Slack handle (sans `@`)

Add new variables in `poll.mjs` → `renderTemplate(...)` call.

### Disable temporarily

Comment out the `schedule:` block in the workflow and commit. `workflow_dispatch` still works for manual runs.

### Why notify-Clark-first instead of auto-DMing the new member?

Trust gradient. The bot's voice and discovery flow need a few real cycles before we'd want it auto-messaging strangers. Once the workflow is stable for ~10 onboards, flip the script to send directly.
