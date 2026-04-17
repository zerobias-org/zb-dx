# AGENTS.md

This repository's authoritative AI/agent instructions live in **[CLAUDE.md](./CLAUDE.md)**.

The content applies equally to Claude Code, Codex, Cursor, Aider, and any other coding agent — read it first. Highlights:

- **Be a self-improving contributor** — auto-learn from non-obvious discoveries, auto-fix doc/reality drift, auto-suggest ideas to `IDEAS.md`, auto-improve `CLAUDE.md` itself
- **Friction logs, patterns, guides, and skills** are the four primary artifact types — see CLAUDE.md for when to create each
- **Patterns lifecycle:** start as flat `patterns/{name}.md`, promote to `patterns/{name}/README.md` after deep dive
- **Frontmatter is required** on artifacts: `status`, `author` (matches `participants/` slug), `app`, `updated` (for patterns)
- **Slash commands:** `/friction` for friction-log lifecycle, `/zb-dx-register` to add yourself to participants
- **Direct-to-main commits are the norm** for friction logs and participant entries — no PR overhead

If you're a new contributor: run `/zb-dx-register` first (or open `participants/README.md` for manual format), then browse `IDEAS.md` for things worth building.
