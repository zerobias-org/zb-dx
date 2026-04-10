# Friction Log Workflow — The Noob's Guide

**Who this is for:** You just joined the `zb-dx` effort. You're building a real app against the ZeroBias SDK/client and you've hit something annoying. You want to know what to do with that annoyance.

**TL;DR:** Run `/friction new "short description of the pain"` and Claude walks you through the rest.

---

## What is the friction log?

The friction log is **a shared notebook of pain points** we hit while using `zerobias-sdk`, `zerobias-client`, and `zerobias-angular-client`. Every entry captures:

1. **What you were trying to do** — your actual goal
2. **What happened** — the confusing/broken thing
3. **What you expected** — the ideal behavior
4. **Your workaround** — if any

Think of it as "I just wasted 2 hours on this, let me save the next person from the same fate."

---

## Why bother?

Three reasons:

1. **You stop being the only person who knows.** If Dan hits the same thing tomorrow, he finds your entry and adds his experience instead of starting from zero.
2. **It escalates cleanly to the backend team.** When enough friction accumulates, we create a ZB platform task with the friction-log as the backstory — so the SDK devs get real user context, not just a one-line bug report.
3. **It feeds the customer-facing dev experience.** Once a friction point is resolved, the learning gets promoted into a guide, pattern, skill, or KB article that external developers benefit from.

---

## The Lifecycle

A friction-log entry moves through these stages:

```
draft  →  confirmed  →  task-created  →  resolved  →  promoted
```

| Stage | Meaning | Who does it |
|-------|---------|-------------|
| **draft** | One dev logged a pain point | The person who hit it |
| **confirmed** | Another dev hit the same thing | The second dev (adds their experience) |
| **task-created** | Escalated to a ZB platform task | Either dev, when it's worth a feature request or bug report |
| **resolved** | The fix shipped (or a decision was made) | Anyone, once the PR merges or the decision lands |
| **promoted** | Extracted into a guide/pattern/KB article | Whoever writes the customer-facing version |

Most entries never reach `promoted` — and that's fine. Some get resolved quickly; others sit at `confirmed` because we have a workaround and there's no urgency.

---

## The Commands

All of these run from any project via the `/friction` slash command (once you've installed it — see setup below):

| Command | What it does |
|---------|-------------|
| `/friction new [title]` | Creates a new entry. Claude asks follow-up questions if needed. |
| `/friction confirm <slug>` | Adds your experience to an existing entry. Bumps `draft` → `confirmed`. |
| `/friction task <slug>` | Creates a ZB platform task linked to the entry. |
| `/friction resolve <slug>` | Marks as resolved, records what actually shipped. |
| `/friction promote <slug>` | Marks as graduated to a customer-facing resource. |
| `/friction list [status]` | Shows entries, optionally filtered. |
| `/friction check` | Polls ZB task status for all escalated entries. |

### Useful flags

- `--severity` / `-s` — `critical`, `high`, `medium`, `low`
- `--app` / `-a` — `sme-mart`, `readiness-center`, `general`
- `--notify` / `-n` — Post an update to `#zb-dx` Slack

---

## Walkthrough: A Real Scenario

Let's say you're building SME Mart and you hit a pain point with the SDK auth flow. Here's the full arc:

### Day 1 — You hit the pain

You spend an hour figuring out that `zerobias-client` silently fails to refresh auth tokens when the network drops. You're angry. You've got a workaround.

```
/friction new "Auth token refresh fails silently when offline" -s high -a sme-mart
```

Claude asks a few questions, creates `friction-log/2026-04-09-auth-token-refresh.md`, commits, and pushes. Status: **draft**.

### Day 3 — Dan hits the same thing

Dan is building Readiness Center and notices a similar issue in his logs. He runs:

```
/friction confirm auth-token-refresh
```

Claude finds your entry, asks Dan about his experience, appends a "Confirmed by dan" section, adds him to subscribers, and bumps status to **confirmed**.

### Day 5 — You decide it's worth escalating

Two of you have now hit this. You both want it fixed in the client library. You run:

```
/friction task auth-token-refresh --notify
```

Claude reads the full entry, uses the ZB MCP to create a feature-request task in the ZB platform, links it in the frontmatter (`zb-task: TASK-4567`), and posts to `#zb-dx`. Status: **task-created**.

### Week 2 — The SDK team ships a fix

You can either wait for the `/friction check` command to detect the task status change, or when you see the release notes yourself:

```
/friction resolve auth-token-refresh
```

Claude asks what shipped, records it, and posts to `#zb-dx` so subscribers (you + Dan) get the @-mention. Status: **resolved**.

### Week 3 — You write a guide about it

The fix ships with a new API pattern. You realize external developers would benefit from a walkthrough:

1. Write `guides/handling-auth-token-refresh.md`
2. Run `/friction promote auth-token-refresh`
3. Claude asks where it was promoted to, updates the frontmatter. Status: **promoted**.

---

## Examples

See `friction-log/examples/` for **5 fictional friction-log entries**, one per lifecycle stage. They're the fastest way to see what "done right" looks like:

- `2026-03-15-example-auth-token-refresh.md` — **draft**
- `2026-03-20-example-entity-pagination.md` — **confirmed**
- `2026-03-25-example-sdk-init-errors.md` — **task-created**
- `2026-03-30-example-connection-timeout.md` — **resolved**
- `2026-03-10-example-angular-ssr.md` — **promoted**

---

## Setup

Once, per machine:

```bash
git clone git@github.com:zerobias-org/zb-dx.git
cd zb-dx
./install.sh
```

The installer asks:
1. **Your name** (clark, dan, etc.) — used as `author` in frontmatter
2. **Global or project-level** — global (`~/.claude/commands/`) is recommended
3. **Symlink or copy** — symlink is recommended (auto-updates when anyone pushes to this repo)

Verify with `./install.sh status`.

---

## When NOT to log friction

Don't log:

- **Genuine bugs in your own code.** If it's your fault, it's not SDK friction.
- **Feature requests unrelated to the dev experience.** Use the normal ZB platform task flow.
- **Ephemeral complaints.** "This SDK is confusing" without specifics isn't actionable.
- **Things you'll fix in 5 minutes.** If it's a quick workaround and nobody else will hit it, skip it.

When in doubt: log it. An entry at `draft` that never moves forward costs nothing. A missed pain point that the next dev rediscovers costs an hour.

---

## Questions?

- **Slack:** `#zb-dx` in the zerobias-org workspace
- **Repo:** [zerobias-org/zb-dx](https://github.com/zerobias-org/zb-dx)
- **Visual version of this guide:** `.claude/docs/friction-workflow.html` — open in a browser
