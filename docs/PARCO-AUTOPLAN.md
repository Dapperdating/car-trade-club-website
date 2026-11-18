# Parco auto page: the artifact, rebuilt as a real page of cartradeclub.com

Status: APPROVED by Costa 2026-11-18 (illustrative data, then "Split for parallel" in reply to "Start building the page from the plan?"). Not built.

Repo: `/Users/costaterranova/clients/CTC website` (note the space: quote every path).
Remote: `https://github.com/Dapperdating/car-trade-club-website.git`, base `main`.
Spawn every lane with `model: "opus"`.

## Open questions

Each was offered with a default on 2026-11-18. Costa answered by asking for the parallel build
without changing any of them, so the defaults stand. He can still change them in PR review.

- [x] URL → `/parco-auto`, folded into §10 (contracts).
- [x] Link from the homepage → yes: a nav link "Le auto" plus one text link under the case studies. The homepage keeps its old look. Folded into §6 (Lane D).
- [x] Where the closing CTA goes → the homepage form `/#interesse` plus `mailto:mattia@cartradeclub.com`, not out to cartradeclub.com. Folded into §3 (Lane A).
- [x] Three galleries repeat a frame (`CTC-6XH5` photos 3=4, `CTC-7271` 2=3, `CTC-Y23D` 1=2) → drop the repeat. Folded into §2.5 (Lane 0).
- [x] `CTC-ZDYP` has no CRM match → keep it. The page doesn't use `ref`.
- [x] Indexing → indexed, but the JSON-LD carries **no** `offers`/`price`, so illustrative prices never become Google rich results. Folded into §6 (Lane D).
- [x] Real CRM cars on the page → not in v1 (§0.2).

---

## 0. Why this exists

Costa has an artifact, **Parco Auto Car Trade Club** (https://claude.ai/artifact/WbZF3wz1DotNbkFRfDhzEy,
version `1794927818-41ed`). It's an Italian marketing page for dealers that shows 87 cars "negotiated by
the network". He wants it on the live site. The artifact's source is saved verbatim at
`docs/reference/parco-auto-artifact.html` (1,103 lines). **That file is the spec for every pixel and
every string.** Port from it; don't redesign.

Page anatomy, with the line numbers in `docs/reference/parco-auto-artifact.html`:

| Part | Markup | CSS | JS |
|---|---|---|---|
| Sticky header (logo, "Le auto", "Come funziona", ink CTA) | 444–454 | 125–138 | n/a |
| Hero with h1, lede, CTAs, checks, and an ink **deal card** for the featured car | 456–474 | 140–182 | 662–676 |
| Stats row (4) | 476–483 | 184–195 | 655–660 |
| Ink "Ultime chiusure" ticker (18 sold cars, marquee) | 485–488 | 197–212 | 678–687 |
| Lime statement band | 490–495 | 214–217 | n/a |
| Inventory: heading, disclaimer, toolbar (status tabs with counts, make, fuel, sort), grid, "Mostra altre" | 497–533 | 219–293 | 689–759 |
| "Come funziona" (4 steps) | 535–546 | 295–305 | n/a |
| Ink closing CTA plus copyable email | 548–564 | 307–323 | 820–826 |
| Footer (legal line plus disclaimer) | 566–571 | 325–326 | n/a |
| Car **dialog**: gallery, facts, ink price panel, status line, CTA | 573–604 | 328–378 | 761–818 |
| Toast, editor, editor bar | 605–640 | 380–434 | 830–1100 |
| Reduced motion | n/a | 436–441 | n/a |

The toast and editor are **not ported** (§0.2).

### 0.1 What makes it more than a copy-paste

1. **The site's old global CSS leaks into any new page.** `app/globals.css` and `app/mobile.css` style
   bare elements, for example:
   - `nav{position:absolute;height:84px;padding:0 5vw;width:100%;…}`
   - `section:not(.hero,.statement,.contrast,.cta){padding:120px 5vw}` (specificity 0,1,1)
   - `section>h2{font:800 clamp(48px,7vw,102px)…}`
   - `footer{display:grid;grid-template-columns:1.3fr 1fr 1fr;padding:55px 5vw;…}`, plus
     `footer>div`, `footer span{color:var(--muted)}` and `footer b`
   - `a:focus-visible,button:focus-visible{outline:3px solid #8bc400}`

   The highest specificity among these is 0,1,1. The cure is in the contracts (§10.4): Lane 0 resets
   them under `div.pa` (0,1,2), and every lane rule is written `.pa .pa-…` (0,2,0).
2. **The site isn't on the design system yet.** The artifact uses `CARVALLO/docs/design/tokens.css`:
   `--ctc-*` variables, the `.ctc-brand`/`.ctc-mark` logo, Manrope and DM Sans, ink/cream/lime. The site
   still uses `--ink`/`--lime` and a "CTC" text logo. Lane 0 brings the tokens in (design rollout §8
   step 1). The artifact uses two values that aren't tokens yet, `--ctc-lede` and `--ctc-shadow-card`.
   They get added locally with a comment (§10.3).
3. **The numbers are illustrative, by Costa's decision.** For example, BMW X3 2025 shows €46,500
   agreed / €54,900 market on the page; the CRM has €13,988 offer / €24,700 valuation. The page
   therefore keeps the artifact's three disclosures **word for word** (§10.5 strings), and the tests
   assert them. Two stats are real: "234 auto" (CRM count) and "2,7 mln €" (CRM valuations sum to
   €2,690,307).
4. **The baseline gate is red on lint and tsc** before any change (evidence §15). So lanes lint
   only their own files and filter tsc's three known errors (§2.3).

### 0.2 Out of scope (don't fold in)

- **The artifact's editor, toast and editor bar.** They depend on the claude.ai runtime. On the site, a
  car changes by editing `data/parco-auto.json` and releasing.
- **Real CRM cars.** `data/cars.json` (234 cars) and `public/cars/` (290 MB, gitignored) exist for
  later. Nothing on this page may reference `/cars/` or `data/cars.json`.
- **Restyling the homepage or guides to the new design.** Lane D adds two links to `app/page.tsx` and
  nothing else.
- **Fixing the existing lint/tsc errors** in `app/privacy`, `app/terms`, `db/`, `worker/` and elsewhere.
- **Per-car pages** (`/parco-auto/[code]`).
- **Releasing to production.** That's a Sites release, Costa's call, not part of this build.
- **Adding `--ctc-lede` / `--ctc-shadow-card` to `CARVALLO/docs/design/`.** That's a separate docs PR in
  the CARVALLO repo; mention it in the PR body.

---

## 1. The rule, and the lanes

**Rule: the page is the artifact. Same sections, same strings, same behaviour, built from
`data/parco-auto.json` with the site's tokens, and nothing outside `/parco-auto` changes except two
homepage links and the sitemap.**

| Lane | Builds | Catches | Risk |
|---|---|---|---|
| 0 | Foundation, done **by the orchestrator** before spawning: base commit, `parco.ts`, tokens, page shell, stubs, base CSS | Every lane codes against real files from minute one | 3/10: one serial hour; a vinext surprise (CSS import, `searchParams`) shows up here first |
| A | Static sections: header, hero + deal card, stats, ticker, band, how, closing, footer | 8 of the 11 page parts | 3/10: lots of CSS, little logic |
| B | Inventory: tabs, selects, sort, grid, load-more, URL filter state | Filtering and sorting match the artifact | 4/10: client state, SSR of the first 24, URL sync |
| C | Car dialog: gallery, keys, swipe, facts, price panel, `?auto=` deep link, click delegation | Every car opens from card, ticker and hero | 5/10: focus, history, `<dialog>` quirks, phone full-screen |
| D | Site integration: homepage links, sitemap, JSON-LD, tests | SEO and regression net | 3/10: edits a minified one-line `app/page.tsx` |
| E | Integrator: merge, gate, browser check against the artifact, PR | Cross-lane look and behaviour | n/a |

---

## 2. Execution model: parallel lanes, one PR

### 2.1 Why this splits cleanly

Lane 0 creates every file once, the lane files as stubs that keep the build green. After that, each
lane owns disjoint files:

| Lane | Owns (edit) | Creates |
|---|---|---|
| 0 (orchestrator) | `app/layout.tsx` (one import line), `data/parco-auto.json` (drop 3 duplicate frames) | `app/lib/parco.ts`, `app/brand-tokens.css`, `app/parco-auto/page.tsx`, `app/parco-auto/parco.css`. Stubs: `app/parco-auto/sections.tsx`, `sections.css`, `ParcoInventory.tsx`, `inventory.css`, `CarDialog.tsx`, `dialog.css`, `jsonld.ts`. Also commits the untracked import (`data/`, `public/parco-auto/`, `scripts/`, `docs/`, `.gitignore`) |
| A | `app/parco-auto/sections.tsx`, `app/parco-auto/sections.css` | `app/parco-auto/CopyEmail.tsx` |
| B | `app/parco-auto/ParcoInventory.tsx`, `app/parco-auto/inventory.css` | none (a `CarCard` may live inside `ParcoInventory.tsx`) |
| C | `app/parco-auto/CarDialog.tsx`, `app/parco-auto/dialog.css` | none |
| D | `app/page.tsx`, `app/sitemap.ts`, `app/parco-auto/jsonld.ts`, `tests/seo.test.mjs`, `package.json` (only the `scripts.test` value) | `tests/parco.test.mjs` |
| E | none (merges; fixes go back to the owning lane's files, in the integration branch) | none |

**Frozen after Lane 0:** `app/lib/parco.ts`, `app/parco-auto/page.tsx`, `app/parco-auto/parco.css`,
`app/brand-tokens.css` and `app/layout.tsx`. A lane that needs one of these changed **stops and
reports** to the orchestrator, which edits it on the base branch and rebases the lanes.

### 2.2 Branching

The repo has no CLAUDE.md or branch rules of its own, so use these:

- **Base branch:** `parco-auto`, cut from `main` by the orchestrator. Lane 0 is one commit on it.
- **Lane worktrees,** one per lane, as siblings of the repo:
  ```sh
  cd "/Users/costaterranova/clients/CTC website"
  git worktree add "../ctc-parco-a" -b parco-auto-a parco-auto
  git worktree add "../ctc-parco-b" -b parco-auto-b parco-auto
  git worktree add "../ctc-parco-c" -b parco-auto-c parco-auto
  git worktree add "../ctc-parco-d" -b parco-auto-d parco-auto
  ```
- **Worktrees have no `node_modules`.** Install once per worktree. pnpm isn't installed globally and
  Node 25 has no corepack, so always go through npx:
  `npx -y pnpm@10.32.1 install --frozen-lockfile`. The store is warm, so it takes about 20 s.
- `public/cars/` is gitignored and absent in worktrees. Nothing needs it.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Lanes don't push.** The integrator merges `parco-auto-{a,b,c,d}` into `parco-auto` locally,
  pushes `parco-auto`, and opens **one PR into `main`**. Nobody merges the PR; Costa does.
- **A git push doesn't deploy.** Production goes through Sites (project
  `appgprj_6a5f2e9ab19881918916f1ed990683ec`). No lane runs a Sites release.

### 2.3 Gate every lane runs before done

Run these from the lane's worktree root (`P="npx -y pnpm@10.32.1"`):

```sh
npx -y pnpm@10.32.1 install --frozen-lockfile        # once per worktree

# 1. Types. Baseline has exactly 3 known errors (db/index.ts, worker/index.ts x2). This must print NOTHING:
npx -y pnpm@10.32.1 exec tsc --noEmit 2>&1 | grep -vE '^(db/index\.ts|worker/index\.ts)\('

# 2. Lint, only your files. Baseline `pnpm lint` is red (10 errors in other files), so never run it as the gate.
npx -y pnpm@10.32.1 exec eslint <every file you own or created>
#    → 0 errors. `@next/next/no-img-element` warnings are accepted (we ship pre-built webp on purpose).
#    Lane D only: record `eslint app/page.tsx` error count BEFORE editing; after, it must not increase.

# 3. Build + tests (vinext build, then node --test on dist/)
npx -y pnpm@10.32.1 test                               # → all pass

# 4. Design grep: no raw colours or font names in your CSS/TSX (tokens only)
grep -nE '#[0-9a-fA-F]{3,8}\b|font-family' <your css/tsx files>   # → nothing (url-encoded SVG in a select arrow is the one allowed exception, see §4)
```

Optional, if you have a browser tool: `npx -y pnpm@10.32.1 dev -- --port 51xx` (A=5101, B=5102,
C=5103, D=5104) and look at `/parco-auto` at 375 px and 1280 px.

### 2.4 Orchestrator checklist

1. **Do Lane 0 yourself, serially** (§2.5). Run the gate (§2.3) on the base branch, commit, and only
   then create the worktrees.
2. Spawn A, B, C and D **at once**, each with `model: "opus"`. Paste the lane's brief (§3–§6) plus
   this line: "Read `docs/PARCO-AUTOPLAN.md` §0, §2.2–§2.3 and §10 first."
3. If a lane reports a contract problem, fix §10 and the frozen file on `parco-auto`, then tell the
   lane to rebase (`git rebase parco-auto`). Never let a lane edit a frozen file.
4. When all four report done, run Lane E (§8).

### 2.5 Lane 0: foundation, done by the orchestrator before spawning

1. Cut the base branch and commit the import that's already in the working tree:
   ```sh
   cd "/Users/costaterranova/clients/CTC website"
   git switch -c parco-auto
   git add .gitignore data/ docs/ scripts/ public/parco-auto/
   git status --short     # expect: .gitignore, data/cars.json, data/parco-auto.json, docs/*, scripts/import-cars.mjs,
                          # public/parco-auto/img/*.webp (418). NOT public/cars/ (ignored), NOT node_modules.
   git commit -m "Import CARVALLO cars and the Parco auto artifact's illustrative set" -m "data/cars.json: 234 CRM cars (scripts/import-cars.mjs). data/parco-auto.json + public/parco-auto/img: the artifact's 87 illustrative cars and 418 curated photos (29 MB). docs/: build plan + artifact source." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
   ```
2. **Drop the duplicate frames** in `data/parco-auto.json`. Remove one `gallery` entry from each car:
   - `CTC-6XH5`: remove `ctc-6xh5-4.webp`;
   - `CTC-7271`: remove `ctc-7271-3.webp`;
   - `CTC-Y23D`: remove `ctc-y23d-2.webp`.

   Leave the files on disk.
3. Create `app/brand-tokens.css`: copy `/Users/costaterranova/clients/CARVALLO/docs/design/tokens.css`
   verbatim, then append the block in §10.3.
4. In `app/layout.tsx`, add `import "./brand-tokens.css";` as the **first** CSS import, above
   `import "./globals.css";`. Change nothing else.
5. Create `app/lib/parco.ts` exactly as §10.1.
6. Create `app/parco-auto/page.tsx` exactly as §10.2.
7. Create `app/parco-auto/parco.css` exactly as §10.4.
8. Create the stubs exactly as §10.6: `sections.tsx`, `ParcoInventory.tsx`, `CarDialog.tsx`,
   `jsonld.ts`, and `sections.css`, `inventory.css`, `dialog.css` (comment only).
9. Run the gate (§2.3). Also check that the page renders through the built worker:
   ```sh
   npx -y pnpm@10.32.1 build && node -e '
   import("./dist/server/index.js").then(async ({default: w}) => {
     const env = {ASSETS: {fetch: async () => new Response("nf", {status: 404})}}, ctx = {waitUntil(){}, passThroughOnException(){}};
     for (const p of ["/parco-auto", "/parco-auto?auto=CTC-6VE4"]) {
       const r = await w.fetch(new Request("https://cartradeclub.com" + p), env, ctx); const h = await r.text();
       console.log(p, r.status, h.includes("Selezione illustrativa: prezzi"), h.includes("Mercedes-Benz GLC"));
     }})'
   ```
   Expect: `/parco-auto 200 true false`, then `/parco-auto?auto=CTC-6VE4 200 true true`. If
   `searchParams` or a page-level CSS import doesn't work in vinext 0.0.50, **fix it here**, before
   spawning, and update §10.2 to match. That's the reason Lane 0 is serial.
10. Commit: `Parco auto foundation: tokens, data lib, page shell, lane stubs`, ending with the
    Co-Authored-By line.

---

## 3. Lane A brief: static sections

> You own `app/parco-auto/sections.tsx` and `app/parco-auto/sections.css`, and you create
> `app/parco-auto/CopyEmail.tsx`. Worktree `../ctc-parco-a`, branch `parco-auto-a`. Read
> `docs/PARCO-AUTOPLAN.md` §0, §2.2–§2.3 and §10 first. The contract signatures are fixed. Don't touch
> any other file. If you think `parco.ts`, `page.tsx` or `parco.css` needs to change, stop and report.

**Blast radius.** `sections.tsx` is imported only by `app/parco-auto/page.tsx` (check:
`grep -rn "sections" app/`). The page renders your 8 exports with the props in §10.2. Nothing else
in the site imports from `app/parco-auto/`.

**The change.** Replace the stubs with real components ported from
`docs/reference/parco-auto-artifact.html`. Use the same markup structure and **the same Italian
copy, character for character**. Class names change `x` → `pa-x` (and BEM `x__y` → `pa-x__y`). CSS goes
to `sections.css`, ported from the line ranges in §0, with every selector written `.pa .pa-…` (§10.4
rule).

- `ParcoHeader()`: markup lines 444–454, CSS 125–138.
  - `<header className="pa-top">` with `<div className="pa-wrap">`.
  - Logo: `<Link href="/" className="ctc-brand" aria-label="Car Trade Club, home"><span className="ctc-mark" aria-hidden="true"/>Car Trade Club</Link>`, using `next/link` (lint forbids `<a href="/">`).
  - `<nav aria-label="Sezioni">` with `<a href="#auto">Le auto</a>`, `<a href="#come">Come funziona</a>` and the ink button `<a className="pa-btn pa-btn--ink" href="#contatti">Entra nel network</a>`.
  - Sticky `top:0`, height `var(--pa-top)`.
- `Hero({ featured })`: lines 456–474, CSS 140–182, JS 662–676.
  - Keep the h1 text exactly: `{TOTAL_CARS_LABEL} auto trattate.` + `<span>Tutte già negoziate.</span>`. It's **the page's only `<h1>`**.
  - The CTAs are `#contatti` (lime "Entra nel network →") and `#auto` (link-underline "Guarda le auto").
  - Deal card: `<a className="pa-deal" href={carHref(featured.code)} data-pa-open={featured.code} aria-label="Apri la scheda dell'auto in evidenza">`.
  - Card image: `featured.gallery[0].src`, `width={1024} height={768}`, `fetchPriority="high"`. Body as JS 662–676, using `eur`, `kmf`, `gain`, `carTitle` from `parco.ts`.
- `Stats({ stats })`: lines 476–483. Show the 4 values `TOTAL_CARS_LABEL`, `TOTAL_VALUE_LABEL`, `stats.marginLabel` and `stats.daysLabel`, with the artifact's captions.
- `Ticker({ cars })`: lines 485–488, CSS 197–212, JS 678–687.
  - Render the list twice inside `.pa-ticker__track`: the second copy gets `aria-hidden="true"` on the copy wrapper and `tabIndex={-1}` on its links.
  - Each item: `<a className="pa-tick" href={carHref(c.code)} data-pa-open={c.code}>`, with thumb `c.gallery[0].thumb` (76×56) and the text `{c.year} · {c.city} · <em>venduta in {c.days} gg</em>`.
  - Pause on hover. Under reduced motion, no animation and `overflow-x:auto`.
- `Band()`: lines 490–495.
- `HowItWorks()`: lines 535–546, `<section id="come">`. Use the artifact's 4 steps verbatim.
- `Closing()`: lines 548–564, `<section id="contatti">`.
  - Lime button: `<Link className="pa-btn pa-btn--lime" href="/#interesse">Attiva la tua zona →</Link>`. Don't link out to cartradeclub.com (§Open questions).
  - The mail row renders `<CopyEmail email={CONTACT_EMAIL} />`.
- `ParcoFooter()`: lines 566–571, `<footer className="pa-footer">`, with two spans: `{LEGAL_LINE}` and `{DISCLAIMER_FOOTER}`.
- `CopyEmail.tsx` (`"use client"`): port JS 820–826. Button text "Copia" → "Copiata" (or "Selezionata" on the fallback), resetting after 1.8 s. The address is in a `<span>` with `user-select: all`.

Rules that bite here:
- **Never put an `<h2>` as a direct child of a `<section>`.** Keep the artifact's
  `section > .pa-wrap > h2` nesting, or the global `section>h2` rule makes it 102 px.
- Use `<section>`, `<nav>` and `<footer>` freely; Lane 0's resets plus `.pa .pa-…` specificity handle
  the leaks. Hard-code nothing: use the constants and helpers from `parco.ts`.

**Interplay.**
- The header links target ids that other lanes own: `#auto` is Lane B's section. `#come` and
  `#contatti` are yours.
- Clicks on `[data-pa-open]` are handled by Lane C's document-level listener. You only render the
  attribute and a working `href` (it works without JS: the page re-renders with the dialog open).
- The lime button: the artifact has two lime CTAs on the cream page (hero, closing on ink) and one in
  the dialog. Keep exactly those; don't add more.

**Tests.** No unit test file. Lane D's `tests/parco.test.mjs` asserts your strings: h1 count 1,
`LEGAL_LINE` and `DISCLAIMER_FOOTER` present. Run `npx -y pnpm@10.32.1 test` and they pass on your
branch as well.

**Done means.** Gate §2.3 is green (eslint on `app/parco-auto/sections.tsx`,
`app/parco-auto/CopyEmail.tsx` and `app/parco-auto/sections.css` isn't linted; grep it in step 4).
- Commit title: `Parco auto: static sections (header, hero, stats, ticker, band, how, closing, footer)`.
  The body lists the artifact line ranges ported and any deviation from the artifact, with the reason.
- Report back: the branch, the commit sha, and screenshots at 375 px and 1280 px if you could take
  them.

---

## 4. Lane B brief: inventory

> You own `app/parco-auto/ParcoInventory.tsx` and `app/parco-auto/inventory.css`. Worktree
> `../ctc-parco-b`, branch `parco-auto-b`. Read `docs/PARCO-AUTOPLAN.md` §0, §2.2–§2.3 and §10 first.
> The contract signatures are fixed. Don't touch any other file. If you think `parco.ts`, `page.tsx`
> or `parco.css` needs to change, stop and report.

**Blast radius.** `ParcoInventory` is imported only by `app/parco-auto/page.tsx` as
`<ParcoInventory cars={cars} />` (check with grep). It's a client component (`"use client"`)
that is **server-rendered first**, so its initial state is what crawlers and no-JS users see.

**The change.** Port markup 497–533, CSS 219–293 and JS 689–759 from
`docs/reference/parco-auto-artifact.html`.

- Root `<section className="pa-inv" id="auto">` with `.pa-wrap`, containing:
  - The heading block, with the eyebrow "Parco auto del network", h2 "Le auto passate da noi." and the
    paragraph verbatim.
  - The disclaimer note, rendering `{DISCLAIMER_INVENTORY[0]}<br/>{DISCLAIMER_INVENTORY[1]}` in
    `<p className="pa-note">`.
- Toolbar `role="group" aria-label="Filtra le auto"`:
  - **Status tabs:** buttons for `all`, `disponibile`, `trattativa`, `venduta` with `aria-pressed` and
    count chips from `countByStatus(cars)`. Labels: Tutte / Disponibili / In trattativa / Vendute.
  - **Selects:** make (`Tutte le marche` + `makesOf(cars)`), fuel (`Ogni alimentazione` +
    `fuelsOf(cars)`), and sort (`SORT_KEYS` with `SORT_LABEL`). Each has an `aria-label`.
  - The `aria-live="polite"` count line:
    `` `${n} auto · ${eur(totalMarket)} di valore di mercato` `` or `0 auto`.
- Grid of cards in `<div className="pa-grid">`. Each card is
  `<a className="pa-card" href={carHref(c.code)} data-pa-open={c.code}>`, containing:
  - The photo: `c.gallery[0].thumb`, `width={560} height={420}`, `loading="lazy"`, plus
    `alt={`${carTitle(c)} ${c.year}`}`.
  - A badge `pa-badge pa-badge--{status}` with `badgeText(c)`, and a photo count `{n} foto`.
  - City and code, title, version, chips (year, km, fuel), price, and the margin pill
    `+{eur(gain(c))} margine`.
- Empty state: the artifact's text, verbatim.
- "Mostra altre N auto": shows `PAGE_SIZE` more each click (N = min(24, remaining)). Hidden when
  nothing remains.
- **State:** `{ status: StatusFilter, make: string, fuel: string, sort: SortKey, shown: number }`.
  - Initial state: `status "all"`, empty make and fuel, sort `"recent"`, `shown: PAGE_SIZE`. **Don't
    read the URL during render** (SSR has none, and you'd get a hydration mismatch).
  - In a `useEffect` on mount, read `Q.status`, `Q.make`, `Q.fuel`, `Q.sort` from
    `window.location.search`. Validate them against the allowed values and apply.
  - On every change, write them back with `history.replaceState`. Build the URL from
    `new URL(location.href)` and set/delete **only your four params**; `Q.auto` belongs to Lane C, so
    never touch it.
  - A filter change resets `shown` to `PAGE_SIZE`.
- List = `sortCars(filterCars(cars, {status, make, fuel}), sort)` from `parco.ts`. **Don't re-implement
  sorting.**
- CSS: the sticky toolbar sits at `top: var(--pa-top)` from 768 px up and is static below. Use the
  artifact's select arrow, a data-URI SVG with `stroke='%2311151b'`. That url-encoded colour is the
  one allowed exception to the hex grep, because it lives inside a data URI. Every selector is
  `.pa .pa-…`.

**Interplay.** You don't open the dialog: Lane C's listener catches clicks on `[data-pa-open]`. Lane C
reads and writes `?auto=` with `pushState`/`replaceState` on the same URL, so preserve unknown params
in yours. Lane D's tests fetch `/parco-auto` and expect the first card titles server-rendered.

**Tests.** No unit test file of your own (no test runner beyond `node --test` on the build). Verify by
hand in dev if you can:
- `?stato=venduta&marca=BMW` on load shows only sold BMWs, and the count line matches.
- The sort "Prezzo crescente" orders available cars first, then the others; each group ascends.
- "Mostra altre" goes 24 → 48 → … and hides at the end.

**Done means.** Gate §2.3 is green (eslint `app/parco-auto/ParcoInventory.tsx`).
- Commit title: `Parco auto: inventory with filters, sort, load-more and URL state`. The body says
  how SSR and hydration stay consistent.
- Report back: the branch, the sha, and the three manual checks above with their results.

---

## 5. Lane C brief: car dialog

> You own `app/parco-auto/CarDialog.tsx` and `app/parco-auto/dialog.css`. Worktree `../ctc-parco-c`,
> branch `parco-auto-c`. Read `docs/PARCO-AUTOPLAN.md` §0, §2.2–§2.3 and §10 first. The contract
> signatures are fixed. Don't touch any other file. If you think `parco.ts`, `page.tsx` or `parco.css`
> needs to change, stop and report.

**Blast radius.** `CarDialog` is imported only by `page.tsx` as
`<CarDialog cars={cars} initialCode={initialCode} />`. Here `initialCode` is a valid car code from
`?auto=` or `null` (page.tsx validates it). **You are the only code that opens cars.** Lanes A and B
render `<a href="?auto=CODE" data-pa-open="CODE">` and rely on you.

**The change.** Port markup 573–604 (without the editor parts: `#edOpen`, `#ed` section), CSS 328–378
and JS 761–818 from `docs/reference/parco-auto-artifact.html`.

- `"use client"`. State: `current: ParcoCar | null` (initially the car for `initialCode`) and
  `idx: number`.
- **Server render:** a `<dialog className="pa-dlg" id="pa-dlg" aria-labelledby="pa-dlg-title">`
  containing the content for `current` when it's set. The title is
  `<h2 id="pa-dlg-title">{carTitle(current)}</h2>`, so `?auto=` renders the car's name in the HTML.
  Lane D's test depends on that.
- **Opening:**
  - On mount, if `initialCode` is set, call `dialogRef.current.showModal()`. Don't push history.
  - `document.addEventListener("click", onClick)` in a `useEffect`, cleaned up on unmount. The handler
    finds `(e.target as Element).closest("[data-pa-open]")`. It ignores the click if
    `e.defaultPrevented`, if `e.button !== 0`, or if meta/ctrl/shift/alt is held (open-in-new-tab keeps
    working). Otherwise it calls `preventDefault()`, sets the current car to
    `el.getAttribute("data-pa-open")`, resets `idx` to 0, calls `showModal()` if not open, and
    `history.pushState(null, "", url)`. Build `url` as `new URL(location.href)` with `Q.auto` set and
    every other param kept.
  - Listen for `popstate`: read `Q.auto`. If it names a car, show it; otherwise close.
- **Closing:**
  - Esc, the ✕ button (`aria-label="Chiudi"`), a backdrop click (`e.target === dialog`), and the lime
    CTA "Voglio auto come questa →" (`href="#contatti"`: close, then let the anchor scroll).
  - On the dialog's `close` event, `history.replaceState` with `Q.auto` deleted, other params kept.
  - Return focus to the element that opened it: remember `document.activeElement` at open time.
- **Gallery:**
  - The main image is `gallery[idx].src` with alt text `` `${carTitle(car)}, foto ${idx + 1} di ${n}` ``
    (the artifact's wording).
  - ‹ › buttons (`aria-label` "Foto precedente" / "Foto successiva"), hidden when there is 1 photo.
  - An index chip `n / N`, and thumbs as buttons with `aria-current` and `aria-label="Foto k"`.
  - ←/→ keys while the dialog is open, ignored when focus is in an input or select. Swipe over 40 px
    on the main image (`touchstart`/`touchend`, passive). Indices wrap around.
- **Info column:**
  - The eyebrow `{code} · {city}`, the title, the version, and a fact grid `<dl>` with 6 rows: Anno,
    Chilometri, Alimentazione, Zona, Stato (`STATUS_LABEL`) and Foto.
  - The ink price panel: label "Prezzo concordato con il privato", `eur(price)`, a row "Valore di
    mercato stimato" with `eur(market)`, and a row "Margine lordo stimato" in lime:
    `+{eur(gain)} (+{gainPct}%)`. The footnote is copied verbatim.
  - The status line uses the artifact's three sentences (JS 803–807); put that map inside your file.
- **Phone:** under 820 px the dialog fills the screen (100vw × 100dvh, radius 0). The info column has
  safe-area padding.
- Every selector is `.pa .pa-…`, or `.pa dialog.pa-dlg` for the element itself. `::backdrop` uses
  `--ctc-scrim`.

**Interplay.**
- Lanes A and B links point at `?auto=CODE` without other params. Your handler, not the browser,
  handles them when JS runs.
- Lane B writes `stato/marca/alimentazione/ordina` with `replaceState`. You must keep those params
  when you push or replace.
- `<dialog>` and `showModal()` are supported in every target browser. No polyfill.
- The lime CTA inside the dialog is the dialog's one lime action. The ✕ button is not lime.

**Tests.** No unit test file of your own. Lane D's test asserts that `/parco-auto?auto=CTC-6VE4`
returns 200 and contains that car's title. Check by hand in dev if you can:
1. Click a card: the dialog opens, the URL gains `?auto=…`, Back closes it.
2. Load `?auto=CTC-P1EJ`: it opens on load. Close it: the URL loses `auto` and keeps any filter.
3. Arrows, thumbs and keys cycle the photos. A 1-photo car (`CTC-ENJZ`) shows no arrows.
4. At 375 px the dialog is full-screen and nothing scrolls sideways.

**Done means.** Gate §2.3 is green (eslint `app/parco-auto/CarDialog.tsx`).
- Commit title: `Parco auto: car dialog with gallery, deep link and click delegation`. The body
  covers history behaviour and focus handling.
- Report back: the branch, the sha, and the four manual checks above with their results.

---

## 6. Lane D brief: site integration and tests

> You own `app/page.tsx`, `app/sitemap.ts`, `app/parco-auto/jsonld.ts`, `tests/seo.test.mjs` and the
> `scripts.test` value in `package.json`, and you create `tests/parco.test.mjs`. Worktree
> `../ctc-parco-d`, branch `parco-auto-d`. Read `docs/PARCO-AUTOPLAN.md` §0, §2.2–§2.3 and §10
> first. The contract signatures are fixed. Don't touch any other file.

**Blast radius.**
- `app/page.tsx` is the live homepage. It's a long, mostly single-line JSX file, so edit surgically.
  The `<nav>` holds `<div className="navlinks">` with "Come funziona", "Case study", "Vantaggi" and the
  button. The case-study sections are `id="case-study"` and `id="case-study-agila"`.
- `app/sitemap.ts` lists 5 paths, and `tests/seo.test.mjs` asserts **the exact same ordered list**
  in two places (lines 7 and 21). Append to all three.
- `jsonld.ts` is imported only by `page.tsx` (§10.2).

**The change.**
1. **Before you edit anything,** run `npx -y pnpm@10.32.1 exec eslint app/page.tsx` and note the
   error count. Your edit must not raise it.
2. In `app/page.tsx`:
   - Add `import Link from "next/link";`.
   - In `.navlinks`, put `<Link href="/parco-auto">Le auto</Link>` first, before "Come funziona".
   - At the end of the `#case-study-agila` section's copy column (`.case-copy`), add
     `<p className="case-note"><Link href="/parco-auto">Guarda tutte le auto trattate dal network →</Link></p>`.
     That reuses an existing class, so no new CSS.
   - Change nothing else.
3. In `app/sitemap.ts`, append `"/parco-auto"` to the array.
4. In `tests/seo.test.mjs`, append `"/parco-auto"` to both path arrays.
5. In `app/parco-auto/jsonld.ts`, implement `buildParcoJsonLd(cars)` (signature in §10.6). It returns
   this, with **no `offers`, no `price`, no `priceCurrency`** anywhere:
   ```ts
   { "@context": "https://schema.org", "@type": "CollectionPage",
     "@id": "https://cartradeclub.com/parco-auto#page", url: "https://cartradeclub.com/parco-auto",
     name: "Parco auto Car Trade Club", inLanguage: "it-IT",
     isPartOf: { "@id": "https://cartradeclub.com/#organization" },
     mainEntity: { "@type": "ItemList", numberOfItems: cars.length,
       itemListElement: cars.map((c, i) => ({ "@type": "ListItem", position: i + 1,
         url: `https://cartradeclub.com/parco-auto?auto=${encodeURIComponent(c.code)}`,
         item: { "@type": "Car", name: `${c.make} ${c.model}`, brand: { "@type": "Brand", name: c.make },
           model: c.model, vehicleModelDate: String(c.year), fuelType: c.fuel,
           mileageFromOdometer: { "@type": "QuantitativeValue", value: c.km, unitCode: "KMT" },
           image: `https://cartradeclub.com${c.gallery[0]?.src ?? ""}` } })) } }
   ```
6. In `package.json`, set `"test": "pnpm build && node --test tests/seo.test.mjs tests/parco.test.mjs"`.
   Change nothing else in that file.
7. Create `tests/parco.test.mjs`. Use the same worker harness as `seo.test.mjs` (import
   `../dist/server/index.js` and the same `render`), and read `data/parco-auto.json` with
   `fs.readFileSync`. Cases, one line each:
   - `/parco-auto` returns 200, has exactly one `<h1`, and has canonical `https://cartradeclub.com/parco-auto`.
   - The HTML contains `© 2026 CAR TRADE CLUB LIMITED`, `Selezione illustrativa: prezzi, margini e disponibilità indicativi.`, `Selezione illustrativa di auto trattate dal network.` and `Prezzi, margini e disponibilità sono indicativi.`. These are the illustrative disclosures and must never disappear.
   - `/parco-auto?auto=CTC-6VE4` returns 200 and contains `${make} ${model}` of that car, read from the JSON (today "Mercedes-Benz GLC"; don't hard-code it).
   - `/parco-auto?auto=NOPE` returns 200 (unknown code is ignored, no crash).
   - Every `gallery[].src` and `.thumb` in `data/parco-auto.json` exists under `public/` (`fs.existsSync`).
   - The JSON-LD on `/parco-auto` parses, has `mainEntity.numberOfItems === cars.length`, and the serialized JSON-LD matches neither `/"offers"|"price"/`.
   - The HTML never contains `openingOffer`, `"/cars/` or `data/cars.json`. CRM data must not leak.
   - `/` contains `href="/parco-auto"`.

**Interplay.** Your tests also pass on the stubs, because Lane 0 put the required strings into them
(§10.6). That way your branch is green alone, and after the merge the same assertions guard Lanes A,
B and C. If a case fails only because another lane's real content isn't merged yet, the contract is
wrong: report it, don't weaken the test.

**Done means.** Gate §2.3 is green: eslint on `app/sitemap.ts` and `app/parco-auto/jsonld.ts` shows
0 errors, and on `app/page.tsx` the error count hasn't grown. `npx -y pnpm@10.32.1 test` shows
4 + 8 passing.
- Commit title: `Parco auto: homepage links, sitemap, JSON-LD and tests`.
- Report back: the branch, the sha, the eslint count for `app/page.tsx` before and after, and the
  test output summary.

---

## 7. Ordering inside the PR

Merge **A → B → C → D** into `parco-auto`, with `--no-ff`, one merge commit per lane. No file
overlaps, so order only matters for bisecting. D goes last so its tests run against the finished
page in the integration gate. All lanes branch from the Lane 0 commit, so no rebases should be
needed.

---

## 8. Lane E brief: integrate, gate, verify, PR

> You are the integrator, working in the main checkout `/Users/costaterranova/clients/CTC website` on
> branch `parco-auto`. You own no files. A fix goes into the owning lane's file, as a commit on
> `parco-auto` that names the lane.

1. `git merge --no-ff parco-auto-a` (then b, c, d). Each merge must be clean. A conflict means a
   lane broke ownership: stop and report.
2. Full gate (§2.3) on the merged tree. Lint every file under `app/parco-auto/`, plus `app/lib/parco.ts`,
   `app/sitemap.ts` and `app/page.tsx` (no more errors than baseline). `npx -y pnpm@10.32.1 test` →
   12 passing.
3. **Browser check against the artifact.** Start dev with `npx -y pnpm@10.32.1 dev -- --port 5100`,
   or add a `.claude/launch.json` entry and use the browser pane. Open `/parco-auto` next to the
   artifact, https://claude.ai/artifact/WbZF3wz1DotNbkFRfDhzEy. At **1280 px** and **375 px**:
   - [ ] Every section appears in order, with matching copy. Diff the visible text: `get_page_text` on
     both, or `curl` the dev page.
   - [ ] No horizontal scroll at 375 px (`document.documentElement.scrollWidth === innerWidth`).
   - [ ] Header sticky; the toolbar is sticky at ≥768 px only.
   - [ ] One lime action per view; lime is never text or a line on cream.
   - [ ] The ticker scrolls and pauses on hover. Clicking a ticker item, the hero card or a grid card
     opens the right car.
   - [ ] Filters, sort and "Mostra altre" work. Reload with the query string and the state is restored.
   - [ ] Dialog: arrows, thumbs, keys and swipe. Back closes it, `?auto=` opens it, and it's
     full-screen at 375 px.
   - [ ] Keyboard only: tab through header → hero → tabs → selects → cards. Enter opens the dialog,
     Esc closes it, and focus returns to the card.
   - [ ] Homepage `/` still looks as before and shows "Le auto" in the nav. Check the guides (two
     pages) and the privacy and terms pages too.
   - [ ] Reduced motion (DevTools emulation): no ticker animation, the ticker scrolls by hand.
4. `grep -rnE '#[0-9a-fA-F]{3,8}\b|font-family' app/parco-auto/` → only the select-arrow data URI.
5. Push `parco-auto` to `origin` and open **one PR into `main`**: `gh pr create --base main --head parco-auto`.
   - Title: `Parco auto: illustrative car showcase page (/parco-auto)`.
   - Body: what the page is; that the numbers are illustrative by Costa's decision and the three
     disclosures are tested; the lane list with commit shas; the gate output; before/after screenshots
     at 375 and 1280 if available; follow-ups (add `--ctc-lede` and `--ctc-shadow-card` to
     `CARVALLO/docs/design/tokens.css` and DESIGN.md §3; production needs a Sites release). End with
     `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
   - **Don't merge, don't release.** Report the PR URL.
6. Remove the lane worktrees (`git worktree remove ../ctc-parco-a` and the rest) once the PR is open.

---

## 9. Verification after merge (Costa or the integrator, on a preview)

1. `npx -y pnpm@10.32.1 test` on `parco-auto` → 12 tests pass, 0 fail.
2. `curl -s localhost:5100/parco-auto | grep -c '<h1'` → `1`.
3. `curl -s 'localhost:5100/parco-auto?auto=CTC-6VE4' | grep -o 'pa-dlg-title[^<]*<'` → shows the
   Mercedes title.
4. `curl -s localhost:5100/sitemap.xml | grep -c parco-auto` → `1`.
5. In the browser at 375 px, `document.documentElement.scrollWidth - innerWidth` → `0`.
6. On `/parco-auto`, filter Vendute + BMW → the count line shows only sold BMWs (the artifact's set
   has 61 sold in total). Clear the filters → `87 auto · … € di valore di mercato`.
7. Open `CTC-ENJZ` → one photo, no arrows, no thumbs.

---

## 10. Contracts: fixed names and signatures (lanes must not deviate)

### 10.1 `app/lib/parco.ts` (Lane 0 writes it verbatim; frozen)

```ts
// Parco auto: data and pure helpers shared by server and client components.
// Data: data/parco-auto.json, the illustrative set from the claude.ai artifact (Costa, 2026-11-18).
import data from "../../data/parco-auto.json";

export type ParcoStatus = "disponibile" | "trattativa" | "venduta";
export type StatusFilter = "all" | ParcoStatus;
export type ParcoPhoto = { src: string; thumb: string };
export type ParcoCar = {
  code: string; ref: string | null; make: string; model: string; version: string;
  year: number; km: number; fuel: string; price: number; market: number;
  status: ParcoStatus; city: string; days: number | null; added: number; gallery: ParcoPhoto[];
};

export const CARS: readonly ParcoCar[] = (data as unknown as { cars: ParcoCar[] }).cars;

// Real figures from the CRM import (data/cars.json): 234 cars, valuations summing to €2,690,307.
export const TOTAL_CARS_LABEL = "234";
export const TOTAL_VALUE_LABEL = "2,7 mln €";
export const FEATURED_CODE = "CTC-6VE4";
export const PAGE_SIZE = 24;
export const TICKER_SIZE = 18;
export const CONTACT_EMAIL = "mattia@cartradeclub.com";

// Illustrative-data disclosures. Tests assert these; never remove or reword them.
export const DISCLAIMER_INVENTORY = [
  "Selezione illustrativa di auto trattate dal network.",
  "Prezzi, margini e disponibilità sono indicativi.",
] as const;
export const DISCLAIMER_FOOTER = "Selezione illustrativa: prezzi, margini e disponibilità indicativi.";
export const LEGAL_LINE = "© 2026 CAR TRADE CLUB LIMITED · Company No. 17413707 · London, United Kingdom";

// URL query params. Lane B owns status/make/fuel/sort, Lane C owns auto.
export const Q = { auto: "auto", status: "stato", make: "marca", fuel: "alimentazione", sort: "ordina" } as const;
export const OPEN_ATTR = "data-pa-open";
export const carHref = (code: string) => `?${Q.auto}=${encodeURIComponent(code)}`;

export const STATUS_LABEL: Record<ParcoStatus, string> = { venduta: "Venduta", disponibile: "Disponibile", trattativa: "In trattativa" };
export const STATUS_FILTERS: readonly StatusFilter[] = ["all", "disponibile", "trattativa", "venduta"];
export const RANK: Record<ParcoStatus, number> = { disponibile: 0, trattativa: 1, venduta: 2 };

export const eur = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
export const kmf = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " km";
export const gain = (c: ParcoCar) => c.market - c.price;
export const gainPct = (c: ParcoCar) => (c.price ? Math.round((gain(c) / c.price) * 100) : 0);
export const carTitle = (c: ParcoCar) => `${c.make} ${c.model}`;
export const badgeText = (c: ParcoCar) => (c.status === "venduta" ? `Venduta in ${c.days} gg` : STATUS_LABEL[c.status]);

export type SortKey = "recent" | "margin" | "priceAsc" | "priceDesc" | "year";
export const SORT_KEYS: readonly SortKey[] = ["recent", "margin", "priceAsc", "priceDesc", "year"];
export const SORT_LABEL: Record<SortKey, string> = {
  recent: "Più recenti", margin: "Margine più alto", priceAsc: "Prezzo crescente",
  priceDesc: "Prezzo decrescente", year: "Anno più recente",
};
const SORTS: Record<SortKey, (a: ParcoCar, b: ParcoCar) => number> = {
  recent: (a, b) => a.added - b.added,
  margin: (a, b) => gain(b) / b.price - gain(a) / a.price,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  year: (a, b) => b.year - a.year,
};
/** Status rank first (available, negotiating, sold), then the chosen key. Same as the artifact. */
export function sortCars(list: readonly ParcoCar[], key: SortKey): ParcoCar[] {
  return [...list].sort((a, b) => RANK[a.status] - RANK[b.status] || SORTS[key](a, b));
}
/** Empty make/fuel means "any". */
export function filterCars(list: readonly ParcoCar[], f: { status: StatusFilter; make: string; fuel: string }): ParcoCar[] {
  return list.filter((c) => (f.status === "all" || c.status === f.status) && (!f.make || c.make === f.make) && (!f.fuel || c.fuel === f.fuel));
}
export const makesOf = (list: readonly ParcoCar[]) => [...new Set(list.map((c) => c.make))].sort((a, b) => a.localeCompare(b, "it"));
export const fuelsOf = (list: readonly ParcoCar[]) => [...new Set(list.map((c) => c.fuel))].sort();
export function countByStatus(list: readonly ParcoCar[]): Record<StatusFilter, number> {
  const out: Record<StatusFilter, number> = { all: list.length, disponibile: 0, trattativa: 0, venduta: 0 };
  for (const c of list) out[c.status] += 1;
  return out;
}
export const findCar = (code: string | null | undefined) => (code ? CARS.find((c) => c.code === code) ?? null : null);

export function getFeatured(): ParcoCar {
  const f = findCar(FEATURED_CODE);
  return (f && f.status === "disponibile" ? f : CARS.find((c) => c.status === "disponibile")) ?? CARS[0];
}
export function getTicker(): ParcoCar[] {
  return CARS.filter((c) => c.status === "venduta").sort((a, b) => a.added - b.added).slice(0, TICKER_SIZE);
}
/** marginLabel e.g. "+24,1%" (mean of gain/price over all cars); daysLabel e.g. "8 giorni" (mean days over sold cars). */
export function getStats(): { marginLabel: string; daysLabel: string } {
  const sold = CARS.filter((c) => c.status === "venduta");
  const avgMargin = (CARS.reduce((s, c) => s + gain(c) / c.price, 0) / CARS.length) * 100;
  const avgDays = sold.reduce((s, c) => s + (c.days ?? 0), 0) / Math.max(sold.length, 1);
  return { marginLabel: "+" + avgMargin.toFixed(1).replace(".", ",") + "%", daysLabel: Math.round(avgDays) + " giorni" };
}
```

### 10.2 `app/parco-auto/page.tsx` (Lane 0 writes it verbatim; frozen)

```tsx
import type { Metadata } from "next";
import "./parco.css";
import "./sections.css";
import "./inventory.css";
import "./dialog.css";
import { CARS, findCar, getFeatured, getStats, getTicker } from "../lib/parco";
import { Band, Closing, Hero, HowItWorks, ParcoFooter, ParcoHeader, Stats, Ticker } from "./sections";
import ParcoInventory from "./ParcoInventory";
import CarDialog from "./CarDialog";
import { buildParcoJsonLd } from "./jsonld";

const DESCRIPTION = "Le auto negoziate dal network Car Trade Club: foto, prezzo concordato con il privato e margine.";

export const metadata: Metadata = {
  title: "Parco auto",
  description: DESCRIPTION,
  alternates: { canonical: "/parco-auto" },
  openGraph: { type: "website", locale: "it_IT", url: "/parco-auto", siteName: "Car Trade Club", title: "Parco auto | Car Trade Club", description: DESCRIPTION, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Car Trade Club" }] },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ParcoAutoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initialCode = findCar(typeof sp.auto === "string" ? sp.auto : null)?.code ?? null;
  const cars = [...CARS];
  const jsonLd = JSON.stringify(buildParcoJsonLd(cars)).replace(/</g, "\\u003c");
  return (
    <div className="pa">
      <a className="pa-skip" href="#auto">Vai alle auto</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ParcoHeader />
      <main id="inizio">
        <Hero featured={getFeatured()} />
        <Stats stats={getStats()} />
        <Ticker cars={getTicker()} />
        <Band />
        <ParcoInventory cars={cars} />
        <HowItWorks />
        <Closing />
      </main>
      <ParcoFooter />
      <CarDialog cars={cars} initialCode={initialCode} />
    </div>
  );
}
```

### 10.3 `app/brand-tokens.css` (Lane 0: CARVALLO `tokens.css` verbatim, then this block appended; frozen)

```css
/* Added for the Parco auto page (artifact values). Not yet in CARVALLO docs/design/tokens.css:
   follow-up docs PR there adds them to tokens.css and DESIGN.md §3. */
:root {
  --ctc-lede: #3c444d;                                        /* lede paragraphs on cream */
  --ctc-shadow-card: 0 24px 60px -24px rgba(17, 21, 27, 0.45); /* the tilted hero deal card */
}
```

### 10.4 `app/parco-auto/parco.css` (Lane 0 writes it verbatim; frozen) and the CSS rule for all lanes

**Rule for lanes A, B and C:** every selector starts with `.pa ` and targets a `pa-` class, for
example `.pa .pa-hero`, `.pa .pa-card:hover .pa-card__ph img`, or `.pa dialog.pa-dlg`. That gives
specificity ≥ 0,2,0, which beats the old globals (max 0,1,1) and Lane 0's resets (0,1,2). Use tokens
only: `var(--ctc-*)` and the `--pa-*` page variables below. Port the artifact's values; `--wrap` becomes
`--pa-wrap`, and the gutters become `--pa-gutter-l` / `--pa-gutter-r`.

```css
/* Parco auto: shared base (Lane 0). Lane rules live in sections.css / inventory.css / dialog.css. */
.pa {
  --pa-wrap: 1180px;
  --pa-top: 68px;
  --pa-gutter-l: max(16px, env(safe-area-inset-left, 0px));
  --pa-gutter-r: max(16px, env(safe-area-inset-right, 0px));
  background: var(--ctc-cream);
  color: var(--ctc-text);
  font: 400 15px/1.5 var(--ctc-body);
  -webkit-font-smoothing: antialiased;
}
.pa *, .pa *::before, .pa *::after { box-sizing: border-box; }
.pa [hidden] { display: none !important; }
.pa a { color: inherit; }
.pa img { max-width: 100%; display: block; }
.pa button, .pa select, .pa input { font: inherit; color: inherit; }
.pa :focus-visible { outline: 2px solid var(--ctc-focus); outline-offset: 2px; }
.pa [id] { scroll-margin-top: calc(var(--pa-top) + 16px); }

/* Neutralise the site's old global element rules (globals.css, mobile.css, forms.css). 0,1,2 beats their 0,1,1. */
div.pa nav { position: static; height: auto; width: auto; padding: 0; border: 0; z-index: auto; display: flex; align-items: center; justify-content: flex-start; }
div.pa section { padding: 0; }
div.pa footer { display: block; padding: 0; border: 0; font-size: inherit; gap: 0; grid-template-columns: none; }
div.pa footer > div { display: block; gap: 0; }
div.pa footer span, div.pa footer b, div.pa footer small { color: inherit; }

.pa .pa-wrap { max-width: calc(var(--pa-wrap) + 64px); margin: 0 auto; padding-left: var(--pa-gutter-l); padding-right: var(--pa-gutter-r); }
@media (min-width: 768px) {
  .pa .pa-wrap { padding-left: max(32px, env(safe-area-inset-left, 0px)); padding-right: max(32px, env(safe-area-inset-right, 0px)); }
}
.pa .pa-eyebrow { font: 700 11px/1.2 var(--ctc-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--ctc-muted); margin: 0; }
.pa .pa-num { font-variant-numeric: tabular-nums; }

.pa .pa-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 22px;
  border-radius: var(--ctc-radius-sm); border: 1px solid transparent;
  font: 800 15px var(--ctc-display); text-decoration: none; cursor: pointer;
  transition: background-color 180ms, color 180ms, border-color 180ms;
}
.pa .pa-btn--lime { background: var(--ctc-lime); color: var(--ctc-ink); }
.pa .pa-btn--lime:hover { background: var(--ctc-lime-hover); }
.pa .pa-btn--ink { background: var(--ctc-ink); color: var(--ctc-on-ink); }
.pa .pa-btn--ink:hover { background: var(--ctc-ink-2); }
.pa .pa-btn--ghost-ink { background: transparent; color: var(--ctc-on-ink); border-color: var(--ctc-on-ink-edge); }
.pa .pa-btn--ghost-ink:hover { border-color: var(--ctc-on-ink-soft); }
.pa .pa-btn--outline { background: transparent; border-color: var(--ctc-ink); color: var(--ctc-ink); }
.pa .pa-btn--outline:hover { background: var(--ctc-ink); color: var(--ctc-on-ink); }
.pa .pa-link-u { font: 700 15px var(--ctc-display); text-decoration: none; border-bottom: 1.5px solid var(--ctc-ink); padding-bottom: 2px; }

.pa .pa-skip { position: absolute; left: 16px; top: -100px; z-index: 60; padding: 12px 16px; border-radius: var(--ctc-radius-sm); background: var(--ctc-lime); color: var(--ctc-ink); font: 800 14px var(--ctc-display); text-decoration: none; }
.pa .pa-skip:focus { top: 16px; }

@media (prefers-reduced-motion: reduce) {
  .pa *, .pa *::before, .pa *::after { animation: none !important; transition: none !important; }
}
```

### 10.5 Shared DOM vocabulary

| Thing | Value | Owner |
|---|---|---|
| Page root | `<div className="pa">` | Lane 0 (page.tsx) |
| Section ids | `inizio` (main, Lane 0), `auto` (Lane B), `come` and `contatti` (Lane A), `pa-dlg` (Lane C) | as listed |
| Open-a-car link | `<a href={carHref(code)} data-pa-open={code}>` on the hero deal card and ticker items (A) and grid cards (B) | handled only by Lane C |
| Dialog title | `<h2 id="pa-dlg-title">` = `carTitle(car)`, server-rendered for `initialCode` | Lane C |
| Headings | exactly one `<h1>` (Lane A Hero). Sections use `<h2>`, never as a direct child of `<section>` | all |
| Query params | `auto` (C, pushState), `stato`/`marca`/`alimentazione`/`ordina` (B, replaceState). Each lane preserves the others | B, C |
| Lime actions | hero CTA, closing CTA (on ink), dialog CTA. No others | A, C |
| Strings asserted by tests | `LEGAL_LINE`, `DISCLAIMER_FOOTER`, both `DISCLAIMER_INVENTORY` lines, the h1 | A, B (render), D (assert) |

### 10.6 Stubs (Lane 0 creates them; the owning lane replaces them, keeping signatures and required strings)

`app/parco-auto/sections.tsx` (Lane A replaces):
```tsx
import type { ParcoCar } from "../lib/parco";
import { DISCLAIMER_FOOTER, LEGAL_LINE, TOTAL_CARS_LABEL } from "../lib/parco";

export function ParcoHeader() { return null; }
export function Hero({ featured }: { featured: ParcoCar }) {
  return <section className="pa-hero" data-featured={featured.code}><div className="pa-wrap"><h1>{TOTAL_CARS_LABEL} auto trattate.<span>Tutte già negoziate.</span></h1></div></section>;
}
export function Stats({ stats }: { stats: { marginLabel: string; daysLabel: string } }) { void stats; return null; }
export function Ticker({ cars }: { cars: ParcoCar[] }) { void cars; return null; }
export function Band() { return null; }
export function HowItWorks() { return null; }
export function Closing() { return null; }
export function ParcoFooter() {
  return <footer className="pa-footer"><div className="pa-wrap"><span>{LEGAL_LINE}</span><span>{DISCLAIMER_FOOTER}</span></div></footer>;
}
```

`app/parco-auto/ParcoInventory.tsx` (Lane B replaces):
```tsx
"use client";
import type { ParcoCar } from "../lib/parco";
import { DISCLAIMER_INVENTORY } from "../lib/parco";

export default function ParcoInventory({ cars }: { cars: ParcoCar[] }) {
  return <section className="pa-inv" id="auto" data-count={cars.length}><div className="pa-wrap"><p className="pa-note">{DISCLAIMER_INVENTORY[0]}<br />{DISCLAIMER_INVENTORY[1]}</p></div></section>;
}
```

`app/parco-auto/CarDialog.tsx` (Lane C replaces):
```tsx
"use client";
import type { ParcoCar } from "../lib/parco";
import { carTitle } from "../lib/parco";

export default function CarDialog({ cars, initialCode }: { cars: ParcoCar[]; initialCode: string | null }) {
  const car = cars.find((c) => c.code === initialCode) ?? null;
  return <dialog className="pa-dlg" id="pa-dlg" aria-labelledby="pa-dlg-title">{car && <h2 id="pa-dlg-title">{carTitle(car)}</h2>}</dialog>;
}
```

`app/parco-auto/jsonld.ts` (Lane D replaces the body):
```ts
import type { ParcoCar } from "../lib/parco";

export function buildParcoJsonLd(cars: readonly ParcoCar[]): Record<string, unknown> {
  return { "@context": "https://schema.org", "@type": "CollectionPage", url: "https://cartradeclub.com/parco-auto", name: "Parco auto Car Trade Club", numberOfItems: cars.length };
}
```

`sections.css`, `inventory.css`, `dialog.css` each contain one line:
`/* Parco auto: <lane> styles. Every selector is `.pa .pa-…` (see docs/PARCO-AUTOPLAN.md §10.4). */`

---

## 11. Risk register

**Lane 0: 3/10**
| Risk | Likelihood | Consequence | Answer |
|---|---|---|---|
| vinext 0.0.50 doesn't pass `searchParams` as a Promise, or ignores page-level CSS imports | low | `?auto=` deep link or page styles break | §2.5 step 9 checks both before spawning; fix there and update §10.2 |
| Tokens import changes other pages | very low | regression on the homepage | tokens.css only adds `--ctc-*` vars and `.ctc-*` classes; E checks the homepage visually |
| JSON import typing | low | tsc error | `as unknown as` cast in §10.1 |

**Lane A: 3/10**
| Risk | Likelihood | Consequence | Answer |
|---|---|---|---|
| Old global CSS leaks (`section` padding, `nav` absolute, footer grid) | medium | broken layout | §10.4 resets plus `.pa .pa-` rule; E checks at 2 widths |
| `<h2>` as a direct child of a section | medium | 102 px headings | called out in the brief |
| Ticker duplicate read twice by screen readers | low | a11y noise | `aria-hidden` on the copy, `tabIndex={-1}` on its links |

**Lane B: 4/10**
| Risk | Likelihood | Consequence | Answer |
|---|---|---|---|
| Hydration mismatch from reading the URL in render | medium | React warning, flicker | read the URL in `useEffect` only |
| Clobbering `?auto=` | medium | dialog deep link lost | `new URL(location.href)`, touch only own params |
| Sort drifts from the artifact | low | different order | `sortCars` is in frozen `parco.ts` |

**Lane C: 5/10**
| Risk | Likelihood | Consequence | Answer |
|---|---|---|---|
| History loops (push on popstate) | medium | Back button stuck | push only on user click; popstate only reads |
| Focus not returned, or a scroll jump on close | medium | a11y and UX | remember `activeElement`; replaceState doesn't scroll |
| Body scrolls behind the modal on iOS | medium | minor | `showModal()` plus `overscroll-behavior: contain` on the dialog |
| Delegated listener swallows modified clicks | low | cmd-click broken | the brief's guard list |

**Lane D: 3/10**
| Risk | Likelihood | Consequence | Answer |
|---|---|---|---|
| A bad edit to the minified homepage | medium | homepage broken | surgical insert; the existing seo tests render `/`; E checks visually |
| Tests too strict on other lanes' content | low | false red after merge | tests use only §10 strings and data-derived values |

**Not doing it:** the artifact stays a claude.ai page that dealers can only see by link. Nothing
breaks.

---

## 12. Evidence appendix (the commands behind §0)

```sh
# Baseline gate on main (2026-11-18): build + 4 SEO tests pass; lint and tsc already red.
npx -y pnpm@10.32.1 install --frozen-lockfile && npx -y pnpm@10.32.1 test    # 4 pass
npx -y pnpm@10.32.1 lint            # ✖ 12 problems (10 errors, 2 warnings): privacy, terms and other existing files
npx -y pnpm@10.32.1 exec tsc --noEmit  # db/index.ts(1,21) TS2307; worker/index.ts(6,11) TS2304; worker/index.ts(7,7) TS2552

# Global element rules that leak (parsed from app/*.css):
#   globals.css: nav{…position:absolute…}  section:not(.hero,.statement,.contrast,.cta){padding:120px 5vw}
#                section>h2{…}  footer{display:grid;…}  a:focus-visible{outline:3px solid #629300}
#   mobile.css:  nav, footer, section:not(.hero…), *:focus-visible outlines, reduced-motion kill switch
#   forms.css:   footer>div{display:grid}  footer span{color:var(--muted)}  footer b

# Artifact → data: 87 cars, 418 file-backed photos (0 uploaded blobs), 3 galleries with a repeated frame
#   (sha256 equal): CTC-6XH5 3=4, CTC-7271 2=3, CTC-Y23D 1=2. 86/87 cars matched to CRM by ref or (year, km).
# Illustrative vs CRM, e.g. CTC-PED1 (CAR-008 BMW X3 2025): page 46,500/54,900; CRM offer 13,988, valuation 24,700.
# CRM totals (data/cars.json): 234 cars; sum(valuation) = 2,690,307.
```
