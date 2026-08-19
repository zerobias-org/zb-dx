# Marketplace mocks — SME Mart

Static HTML mockups of the **SME Mart Marketplace** surfaces, for design review before any code
is written. Same house pattern as [`../boundary-project-mocks/`](../boundary-project-mocks/):
one self-contained `.html` per screen, no build, no framework, real HTML composited on a
screenshot of the app shell.

**Open them straight off disk** — no server needed, no network calls.

---

## Screens

- **`html/rfp-list-vendor.html`** — Open RFPs, **vendor view**. Table of RFPs currently accepting
  bids, with the vendor's own eligibility derived per RFP, and a detail drawer carrying the
  itemised pre-requisite pairs and the hand-off link to the Projects App.
  Deep link: `?rfp=<id>` opens with that RFP's drawer already open.

---

## What these screens are careful about

**Eligibility is per-vendor and per-RFP.** A vendor cannot bid until *their own* pre-requisite
`req<>sat` pairs are accepted by the buyer. The RFP's requirement set is a **template** authored
once; candidacy **instantiates** it per candidate. So nothing another vendor submits can make you
eligible, and clearing one RFP's pre-reqs does not carry to another. Both the summary strip and
the drawer say this in words, because it is the thing most likely to be misread.

**Both legs of a pair are shown.** Each pre-req names the buyer's demand *and* what the vendor
supplies, plus who currently has the ball. The live substrate is one-legged today (close = done,
no mirror) until Project-as-Reactor lands — the mocks deliberately show the **full two-legged
shape**.

**No money anywhere.** The Ledger owns pricing and budget was dropped from the model, so there is
no budget or price column — not even as mock text.

**The lifecycle vocabulary is fenced.** Only `Open` and `Closing soon` appear. The proposed
six-state RFP lifecycle is **unconfirmed**, and painting it here would harden a guess into a
reviewed artifact.

**Marketplace does not manage the RFP.** The drawer's hand-off block links out to the Projects
App, which owns requirements, boards, tasks, documents and the award. That boundary is drawn
visibly rather than implied.

---

## ⚠️ The shell background is a stand-in

`assets/portal-shell-empty.png` is the **Projects app's** Portal chrome, borrowed from
`boundary-project-mocks`. SME Mart's real bar is slate blue with a storefront glyph, the name
**SME Mart**, and exactly two tabs — **Services** and **RFPs**.

So each screen **paints the whole top bar in HTML** over the PNG and lets only the left rail show
through. A partial overlay would leave a visible seam where slate meets black.

**Before these go to PR, capture a real SME Mart shell** (empty content area, 2140px wide) and
drop the HTML bar. The left rail in the borrowed PNG is still the Projects rail and will read
wrong to anyone who looks closely.

---

## Adding a screen

1. Add `html/<screen>.html`, self-contained.
2. Add its bullet to the **Screens** list above.

That is the whole process — no generator, no lint, no manifest. (`../SYNC-RECIPE.md` governs the
architecture **docs**, not these mocks.)

### House pattern, in one place

- Single `.html`, inline `<style>` and `<script>`, vanilla JS, no libraries, no imports.
- `html{width:2140px}`, `body` 2140px wide / `min-height:1267px`, content at
  `margin:68px 0 0 64px`.
- Body carries the shell PNG as its background at `0 0 / 2140px auto no-repeat`.
  **Give body `display:flow-root`** — without it the content's 68px top margin collapses through
  the body and drags the background down with it.
- Dark tokens: `color-scheme:dark`, `--zb-primary:#03aff0`, `--panel:#424242`,
  `--panel-2:#3a3a3a`, `--dim:#9aa0aa`, `#fff` on `#303030`, base font 16px.
- Data inlined as JS. `fixtures/*.json` documents the shapes for humans and is **not** loaded.
- Drawer is **LAYOUT A, locked** (Clark, 2026-08-05): 460px fixed, container scoped to the table
  region rather than the page, `side` mode so it pushes content, no backdrop. Row actions carry
  the same affordances as the drawer so every action is reachable without opening it.
- Deep links read `new URLSearchParams(location.search)`. If a screen writes the URL back,
  **guard `history.replaceState` in a try/catch** — it throws on `file://`, which is how these
  are normally opened.

---

## Source of truth

These mocks are drawn from specs on the shared shelf, not invented here:

- `zb-mesh/_coord/sessions/gsd-plan/marketplace-rfp-arc-spec-2026-08-18.md` — the arc
- `zb-mesh/_coord/sessions/gsd-plan/mockup-spec-rfp-list-vendor-2026-08-19.md` — this screen
- `zb-mesh/marketplace/REQUIREMENTS.md` — R4 (RFP lifecycle), R5 (bids), R7 (vetting)

Platform vocabularies used (`projectType=Rfp`, `visibility`, `status`, `lifecycle`) are real and
were verified against `@zerobias-com/platform-sdk` on 2026-08-18. See `fixtures/rfps.json`.
