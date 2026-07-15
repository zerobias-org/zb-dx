# Boundary × Projects — Compliance Readiness UI Mockups

Static HTML prototypes of the ZeroBias **Boundary Manager × Projects** compliance-readiness experience. They exist to show *what the apps should look and behave like* — a visual/interaction reference for building the real Angular apps. They are **not** production code and connect to **no** backend.

## Run them (no setup)

Open any file in `html/` directly in a browser — **double-click it**, or drag it into a tab. Pure static HTML/CSS/JS: no build step, no `npm install`, no dev server, no tokens. Runs from any desktop machine, **fully offline** — every asset is either a local PNG in `assets/` or inlined as a data-URI, so there are no network dependencies.

Start with `html/program-overview.html` or `html/projects-cmmc-readiness.html` — the mocks cross-link to each other via the in-page navigation, so you can click through the whole set.

## What's here

```
boundary-project-mocks/
├── html/         # 14 screens — the mockups themselves
├── assets/       # shell-background PNGs the screens sit on
├── fixtures/     # reference JSON data (see "About the data")
└── README.md     # this file
```

### The 14 screens
- **Boundary Manager (the runtime control plane):**
  - `bm-components-list.html` — Operations Center → Components list (RACI is the spine)
  - `bm-component-detail.html` — a single Component's detail
  - `bm-software-inventory.html` — software-component inventory (SBOM lane)
  - `bm-tool-inventory.html` — tool inventory (enforcement/checking tools)
- **Projects (the measurement layer over the boundary):**
  - `program-overview.html` — program umbrella overview (6-column panel grid)
  - `program-readiness.html` — program-level readiness rollup
  - `projects-overview.html` — a single project's overview
  - `projects-cmmc-readiness.html` — CMMC readiness: framework element tree, controls-centric ↔ assets-centric lenses, advisory crosswalk toggles
  - `projects-requirements.html` — requirements with anchored control mappings + evidence
  - `projects-coverage-forecast.html` — coverage forecast
  - `projects-system-state.html` — system-state / timeline view
  - `projects-boards.html` — the project's boards
  - `projects-board-kanban.html` — a work-type board (open with `?b=default|evidence|findings|poam|remediation`)
- **Cross-party:**
  - `transparency-center.html` — buyer/seller transparency center (entangled tasks, 3PAO/measurement conduit)

## About the data (read before you trust any value)

- **All identifiers are obfuscated.** Every UUID has been replaced with a synthetic placeholder (`e0000000-0000-4000-8000-…`), applied *consistently* so cross-references between screens/fixtures still line up. **Do not treat any ID here as a real ZeroBias resource id.**
- **People and companies are fictional.** Personas like "Chris Vale" / "Kevin Ross" and the "Acme" demo org are made up.
- **`fixtures/` is reference data, not runtime-loaded.** The screens inline their own data as JS; the JSON files document the *shapes* the real app works with (project-type tree, crosswalk catalog, CMMC instances). Useful when you build the real data layer; not required to run the mocks.
- **Framework/control codes are real public standards** (CMMC `AC.L2-3.1.1`, SOC2, ISO 27001, SCF, etc.) — those are intentionally accurate.

## How the screens are built (orientation for editing)

- **Each file is self-contained** — one HTML document with its `<style>` and `<script>` inline. No shared bundle, no framework, no imports. Edit one screen without touching the others.
- **Shell-background technique:** each screen is a **2140px-wide** canvas. The real app's chrome (nav rails, headers) is a **screenshot PNG** from `assets/`, set as the page `background`; the mocked content is real HTML positioned on top. That's why the backgrounds are referenced as `url("../assets/…png")` (relative — they travel with this folder).
- **Cross-links** between screens are plain relative `href="other-screen.html"` (some carry query params like `?b=findings` or `?c=vm` to select a view). They resolve as long as the `html/` folder stays intact.
- **Interactivity** (lens toggles, crosswalk switches, drill-downs) is vanilla JS in each file — no libraries.

### If you point your Claude at this
Tell it:
- These are **static mock HTML** files — edit the inline HTML/CSS/JS directly; there is no build/framework/backend.
- **IDs are obfuscated synthetic UUIDs** — never wire them to a live API expecting them to resolve, and don't "fix" them to look real.
- The **background PNGs are app screenshots**; content is overlaid HTML on a 2140px canvas. To move/resize content, edit the HTML — don't try to edit the PNG.
- `fixtures/` documents the **real data shapes** to build against, but the mocks don't fetch them at runtime.
- Keep screens **self-contained**; don't introduce a shared bundle or a framework.

## Self-contained
No network dependencies: shell backgrounds are local PNGs in `assets/`, and the logo / resource-type icons are inlined as data-URIs. The mocks render identically online or offline.
