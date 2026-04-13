# Participants

One file per developer contributing to `zb-dx`. The main repo README generates its participant table from this directory.

## Adding yourself

**Easiest way:** run `/zb-dx-register` — it'll prompt you for the info and commit the entry for you.

**Manual way:** create `{your-slug}.md` with the frontmatter below.

## Format

```yaml
---
name: Your Full Name
org: Your Company or Team
slack: "@your-handle"           # handle in #zb-dx Slack channel
github: your-github-username
app: App Name                    # what you're building on ZB
focus: area-of-focus             # e.g. "Angular client patterns", "SDK ergonomics"
joined: YYYY-MM-DD
---

# Your Name

Optional bio, links to your friction-log entries, patterns you've contributed,
or anything else you want fellow developers to know.

## Contributions

- [Friction log entries](../friction-log/) — filter by `author: your-slug`
- [Patterns contributed](../patterns/) — list as you create them
- [Guides contributed](../guides/) — list as you create them
```

## Slug conventions

Use `firstname-lastname` lowercase, matching the `author` field on your artifacts:
- `clark-stacer.md`
- `dan-simonca.md`
- `joe-llamas.md`
