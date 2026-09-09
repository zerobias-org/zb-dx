---
name: zb-mock
description: Build a static HTML mock of a screen inside a ZeroBias app — one self-contained file carrying real app chrome (top bar + left rail) around fake content, themed from the published zb-theme.css design tokens. Use when asked for a mock, mockup, mock screen, wireframe, or visual prototype of a ZeroBias UI. NOT for diagrams, architecture drawings, or written documents.
---

# ZeroBias mock screens

A **mock** is a static HTML prototype of a screen inside a ZeroBias app: real app chrome around
fake content. It exists to show a design or an idea — to a colleague, a customer, or a developer
about to build it — without building the thing first.

One self-contained HTML file. No build step, no framework, no backend, no local assets. Open it
in a browser.

**Start from `templates/mock-screen.html` in the zb-dx repo.** It carries the app shell, the theme
wiring, and inline comments explaining each decision. Copy it; do not start from a blank file.

Finding it when this skill is installed globally: `install.sh` writes the clone location to
`~/.claude/zb-dx.json` as `repo_path`, so the template is `<repo_path>/templates/mock-screen.html`.
If that file is missing, ask where zb-dx is checked out rather than guessing a path.

---

## 1. What the template gives you, and what you change

The template has three slots and a shell:

| Part | What you do |
|---|---|
| **SLOT 1** — `<title>` | Name the screen: `<App> — <Screen> (<what is being shown>)` |
| **Shell markup** — `.zb-bar`, `.zb-rail` | Set the app name, icon, top-bar tabs, rail items, current app |
| **SLOT 2** — page body | Your screen |
| **SLOT 3** — `<style>` tail | Styles for your screen only |

Everything else — the shell CSS, the theme links, the canvas setup — stays as it is. Edit the
shell's **markup**, not its rules.

---

## 2. Configure the shell

- **App name and icon** — the `.app-name` text and `.app-icon` `src`:
  `https://cdn.zerobias.com/static/images/nav/color/app_<name>.svg`
- **Top-bar tabs** — one `<a>` per tab in `.zb-bar .tabs`; `class="active"` on the current one.
- **Left rail** — one `<a>` per app, `class="active"` on the app you are inside. Icons:
  `https://cdn.zerobias.com/static/images/nav/white/app_<name>.svg`. Names in use:
  `app_data_collection`, `app_governance`, `app_projects`, `app_solution_portal`, `app_tasks`,
  `app_learning_center`.
  - **Every rail row needs a `<span class="label">`.** The rail expands on hover — 64px to 238px
    after a 400ms delay — and the label is what appears. A row without one shows a nameless icon
    in the expanded state.
  - **Group headings are `<div class="rule"><span>My Apps</span></div>`.** Collapsed, the span
    has zero width and the rule fills the space; expanded, the label appears and the rule fills
    what is left. Omit the span for a plain separator.
  - **The rail has its own background** (a subtle radial-gradient) and must not match the content
    area. Do not flatten it to a solid colour or make it transparent — the column disappears.
- **Status chip** — the `ALPHA` pill. Delete the element if the app you are mocking has no badge.
- **User block** — a fictional name and org. Never a real person's.

### Canvas width

`--canvas` defaults to `2140px`, a wide-desktop canvas. Because the shell is markup rather than
an image, this is a free choice: `100%` gives you a mock that resizes with the window. Keep it
fixed if your screen has a px-sized grid.

---

## 3. Theme from `zb-theme.css`. Never from a screenshot.

<https://cdn.zerobias.com/static/stylesheets/zb-theme.css> is generated from the same design
tokens every ZeroBias app compiles, and is published so that non-Angular pages can match the apps
without copying values.

- **Use `var(--zb-*)`.** If a colour needs a name, add an alias in the template's `:root` block
  that resolves to a token. Do not write a raw hex further down the file.
- **Never eyedrop a colour off a screenshot.** Two colours that circulated in earlier ZeroBias
  mocks turned out to exist in no stylesheet anywhere — sampled from an image, plausible-looking,
  copied forward for months before anyone checked. Screenshots are lossy, monitor-profiled, and
  often show a colour composited over something else.
- **A few shell values genuinely have no token** — the toolbar black, the inactive tab label
  grey, the status chip amber, the rail's rule and gradient. Each carries a `MEASURED` comment
  saying so. If you need to add one, do the same: measure it off a running app, comment it, and
  say plainly that no token exists.

### Both dark switches, always

The component library scopes dark to `body.dark-theme`; `zb-theme.css` also aliases
`[data-theme="dark"]` / `[data-dark-mode]` on the root. **The template sets both** — the root
attribute so a script reading tokens off `document.documentElement` gets dark values, the body
class so markup pasted out of a running app keeps working. Remove either and the page
half-themes.

There is no `prefers-color-scheme` rule on purpose: a mock should look the same to everyone
reviewing it.

### Load Roboto — declaring it is not enough

The template links `fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap`, the same
URL the ZeroBias portal uses. **Roboto is not installed on a stock Mac**, so a `font-family:
Roboto, …` declaration with no webfont silently falls back to Helvetica Neue. The two are close
enough in metrics that comparing a rendered text width will *not* catch the difference — check
`document.fonts.check('400 16px Roboto')` instead. It is obvious to the eye, though, so a
reviewer will spot it before you do.

### Font sizes — body is 14px

`--zb-font-size-xs` through `-xl` are 12 / 14 / 16 / 18 / 20, and **14px is body** in the real
apps. If you are used to a 16px minimum from document or report styling, it does not apply here:
a 16px floor makes every mock visibly larger than the app it is mocking.

---

## 4. Measure, do not eyeball

If the chrome looks wrong, or you need a value the template does not have, **read it off a
running app** rather than nudging pixels until it looks close.

With the app open in Chrome and devtools available (the `chrome-devtools` MCP server, or the
console), `getBoundingClientRect()` and `getComputedStyle()` on the toolbar and nav elements will
give you exact numbers in one pass. Everything in the template came from there — including three
mistakes that a visual comparison had already missed: a tab strip 42px off, rail rows misplaced
because a separator had no margins, and a bottom item flush instead of inset.

The same technique settles questions the CSS cannot answer on its own. The rail's hover-expand,
for instance, is a class the app toggles on a timer — the 400ms delay was measured with a
`MutationObserver` on that class, not guessed.

---

## 5. Fake data, honestly fake

- **Keep the mock-data banner.** It is in the template. Every screen should say on its face that
  what you are looking at is not real.
- **Obfuscate every identifier.** Synthetic UUIDs (`e0000000-0000-4000-8000-…`), applied
  *consistently* so cross-references between screens still line up. Never a real resource id —
  a mock that looks live invites someone to wire it up.
- **People and companies are fictional.** Never a real customer, a real colleague, or a real org.
- **Standards and control codes are real** — CMMC `AC.L2-3.1.1`, SOC 2, ISO 27001, and so on.
  Those should be accurate; fictionalising them makes the mock useless for the conversation it
  is meant to support.
- **Inline the data as JS.** Mocks do not fetch at runtime — no `fetch`, no XHR, nothing that
  can fail or hang while someone is reviewing your screen.

---

## 6. One file

One HTML document with its `<style>` and `<script>` inline. No shared bundle, no imports, no
libraries, no local asset files. Icons and logos are either CDN URLs or inline SVG.

Four remote references are deliberate: `zb-theme.css`, the Roboto webfont, the Material Icons
font, and the ZeroBias CDN icons. That is the trade for having no local files — and the
alternative, a vendored copy of the tokens, is exactly the drift the published stylesheet exists
to end.

Cross-links between screens are plain relative `href="other-screen.html"`, optionally with a
query param to select a view (`?tab=findings`).

---

## 7. Leave it findable

Add the screen to your mock folder's `README.md` with a one-line description of what it shows. A
folder of HTML files with no index is a folder nobody opens.

---

## Failure-Mode Anchors

*Sign you started from the wrong thing: your `<body>` has a `background: url(...png)` and the content is positioned on top of it. That is the screenshot approach the template exists to replace.*

*Sign you invented a colour: you wrote a hex literal with no `MEASURED` comment and no `--zb-*` behind it. Every one needs a token, or a measurement plus a note that no token exists.*

*Sign the font is wrong: text looks subtly off against the real app. You declared `font-family: Roboto` but dropped the Google Fonts link. Comparing text widths will NOT catch this — check `document.fonts.check('400 16px Roboto')`.*

*Sign the rail vanished into the page: the left rail is the same colour as the content area. You flattened its gradient or made it transparent.*

*Sign the rail does not expand: hovering does nothing, or it snaps open instantly. It should widen 64 -> 238 after a 400ms delay. Check the `.zb-rail:hover` transition-delay, and that every row has a `.label`.*

*Sign the shell collapsed onto the content: the top bar overlaps your page header and everything sits ~68px low. You removed `display:flow-root` from `body` — `.content`'s top margin is collapsing through it.*

*Sign you broke dark mode: the page renders light, or a script reading `getComputedStyle(document.documentElement)` returns a light value. You set `body.dark-theme` without `data-theme="dark"` on `<html>`, or the reverse.*

*Sign you applied the wrong font rule: your body text is 16px. Mocks are 14px.*

*Sign you nudged instead of measuring: you adjusted an offset until it "looked right." If the app is running, read the rect.*

*Sign the mock is not findable: you created a screen and did not add it to the folder README.*
