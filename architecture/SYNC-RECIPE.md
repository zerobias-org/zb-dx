# Architecture Docs Sync Recipe

**Goal:** keep `transparency-architecture.{md,html}` (+ `CHANGELOG.md`, `patterns/`) current as ZeroBias
backend/platform features ship, so the 3 third-party dev teams (SME Mart, Readiness Center, Work Worlds)
are reading an accurate substrate. Run on a cadence (a few times/week) or manually when a notable platform
feature lands. **Not real-time** today — the cadence is the safety net against staleness.

This doc is the operator's checklist. A condensed version lives in memex
(`zerobias/zb-dx/architecture-docs-sync-recipe`) for agent recall.

---

## Sources of truth (READ these; never invent)

Pull latest before reading each.

| Rank | Source | Path | What to harvest |
|---|---|---|---|
| **1 (model)** | BM×Projects current-state model | `~/Projects/zb/boundary-projects-mocks/MODEL.md` | The clean current data model (continuous-assessment framing · Program/Phase/Assessment types · the four axes · Component-RACI · terminology). Director-maintained; supersedes model bits scattered in that folder's `BRIEF.md`. Feeds `continuous-assessment-model.{md,html}`. |
| **1 (status)** | zb/ui Backend FR tracker (PRIMARY) | `~/Projects/zb/ui/.claude/docs/BACKEND_FEATURE_REQUESTS.md` | FR status transitions: `DRAFT → FILED → LIVE/verified`; new link-types; new platform fields; reshaped endpoints. The "LIVE on CI/dev/prod" lines are the freshness signal. |
| 2 | zb/ui platform reference docs | `~/Projects/zb/ui/.claude/docs/PLATFORM_RESOURCE_LINKS_REFERENCE.md`, `FILESERVICE_REFERENCE.md`, roles ref | Verified primitive behavior (link-types, file rules, RBAC). |
| 3 | SME Mart decisions + rulings | `…/sme-mart/.planning/director/DECISIONS.md`, `project-link-type-vocabulary-proposal-*.md`, `.planning/docs/RDF-COMPASS.md` | Model rulings (hierarchy, engagement, vetting), resolved open-questions. |
| 4 | memex (model rulings) | `~/basic-memory/memex/zerobias/platform/*`, `…/sme-mart/*` | Canonical rulings (one-project-entity axes, mirrored engagement, transparency invariant). Local only — not reachable from cloud. |
| 5 | ZB MCP (optional live check) | `linkTypeSearch`, `zerobias_describe` | Confirm a "LIVE" claim before upgrading the doc's status. Acquire the profile lock first. |

**Authority order:** when sources disagree, the live platform/MCP wins, then the zb/ui FR tracker, then SME
Mart decisions. Never cite the deprecated Next.js SME Mart app.

## Target docs (UPDATE these)

- `architecture/transparency-architecture.md` — transparency state-machine content source of truth.
- `architecture/transparency-architecture.html` — **mirror** (see HTML fan-out gotcha).
- `architecture/continuous-assessment-model.md` — compliance / continuous-assessment content source of truth (from MODEL.md).
- `architecture/continuous-assessment-model.html` — **mirror** (5 tabs; same HTML fan-out gotcha; mocks tab held until the Director finalizes `boundary-projects-mocks/` mocks).
- `architecture/CHANGELOG.md` — log every change, newest first. **The top entry's heading + first paragraph is posted verbatim to #zb-dx on merge** (via `architecture-docs-notify.yml` → `automation/notify-docs-change.mjs`), so write the lead paragraph for that audience.
- `architecture/patterns/*.md` — add a `superseded`/`reconcile` banner if a ruling invalidates a pattern.

---

## Procedure

1. **Pull** all three repos: `zb/ui`, the SME Mart app fork, `zb-dx`.
2. **Find the last sync date** = the top dated entry in `architecture/CHANGELOG.md`.
3. **Diff the sources since that date.** `git log --since=<date> -p` on the zb/ui FR doc + `…/sme-mart/.planning/`.
   Scan for: status transitions (PLANNED→FILED→LIVE), new/renamed link-types or entities, new platform fields,
   model rulings. List the material deltas (ignore typo/format churn).
4. **Map each delta to architecture-doc sections:** §0 thesis · §3 Party/Boundary/Engagement · §4 Projects ·
   §5 ResourceLinks · §6 Boards · §8 entangled task pairs · §10 ontology · §11 RDF compass · §14 glossary.
5. **Edit the `.md`** — surgical, match existing voice + `[EXISTS]`/`[PLANNED]` chip convention.
6. **Mirror EACH delta into the `.html`** across ALL parallel representations (see gotcha). `grep` the anchor
   phrase first to find every copy.
7. **Update `CHANGELOG.md`** (newest first): dated heading · authoritative source cited · files touched · what's
   unchanged.
8. **Commit on a branch; open a PR against `zb-dx`** for review. Do NOT auto-merge. Do NOT push to a shared
   default branch. Do NOT notify anyone (Clark relays).

---

## Gotchas (these cost time if missed)

- **HTML fan-out — the big one.** One MD fact appears in 3–6 places in the `.html`: (a) section prose,
  (b) table cells, (c) the `<dt><dd>` glossary, (d) the JS-string tooltip glossary object (`GLOSSARY = {…}`),
  (e) an embedded raw-markdown glossary block, (f) Mermaid node labels. Grep the anchor phrase and fix EVERY copy.
- **HTML is NOT regenerated.** Surgical Edits only — the interactive shell (tabs, Mermaid resize/fullscreen,
  scroll-spy) is hand-built and would be lost by a visual-explainer re-render. The CHANGELOG convention line
  ("generated via visual-explainer") is aspirational; in practice it's hand-mirrored.
- **HTML entities:** match existing style — `&harr;` `&rarr;` `&mdash;` `&hellip;`. Not literal Unicode.
- **Mermaid labels:** only `<br/>` allowed inside a node label; ASCII only (no entities, no `<b>`), or the
  diagram throws "Syntax error in text".
- **snake_case predicates:** link-types render via the UI `snakeToSpaces` pipe — use `engaged_by`/`satisfied_by`,
  not camelCase, to match the registry.
- **Environment qualifier is load-bearing:** "LIVE on CI" ≠ "LIVE on prod". Copy the exact env from the source;
  don't drop it.
- **Don't upgrade status without the source saying so.** FILED ≠ LIVE. The FR doc's exact wording is the gate.
- **JS-string glossary quoting:** escape apostrophes; keep trailing commas consistent with neighbors or the
  tooltip JS breaks silently.

## Done-check

- [ ] `.md` edited; `.html` mirrored in every representation (grep the anchor → 0 stale copies).
- [ ] CHANGELOG entry added (newest first, source cited, files listed).
- [ ] No stale phrasing left (grep the old wording → 0).
- [ ] PR opened against zb-dx; nothing auto-merged.
