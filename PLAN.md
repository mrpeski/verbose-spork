# Magazine Flipbook Portfolio (StPageFlip) — Tracer-Bullet Plan

## Context

The portfolio (branch `portfolio`) is currently a single tall scrolling page: `portfolio.sh` concatenates `portfolio/components/*.html` fragments into `portfolio/index.html`, with a horizontal sticky nav anchoring to 8 sections. The user wants a magazine feel like HTML5pub: a vertical table-of-contents on the left, a flipbook on the right, and clicking a section flips the book to that section's page.

**Decisions (user-confirmed):** use **StPageFlip** (`page-flip` browser bundle via CDN, no React); **replace** the scroll layout entirely; **redesign section content** into fixed-size magazine pages (splitting tall sections); on **mobile**, a hamburger opens a slide-out left drawer and the book renders single-page portrait. Keep the bash build (`portfolio.sh`) and `deploy.sh` flow.

Key technical facts: StPageFlip's `loadFromHTML` **moves** (doesn't clone) DOM nodes, so existing jQuery component bindings survive; `useMouseEvents: false` stops the library swallowing input/drag events for the form and kanban.

The plan is organized as **tracer bullets**: each milestone is a thin end-to-end slice that builds, runs, and is verified in the browser before the next one starts. The riskiest assumptions (flip engine + interactive jQuery components inside transformed pages) are proven in the first two bullets, before any content redesign.

---

## Bullet 1 — Skeleton book flips end-to-end (proves the engine + build pipeline)

Smallest possible slice through every layer: build script → shell → StPageFlip → nav sync.

- `portfolio/components/shell-open.html` (new): `.app-shell` > `<aside id="toc">` with `<a data-page="N">` links > `.book-area` > `<div id="book">` (left open).
- `portfolio/components/shell-close.html` (new): closes `#book`; `.book-controls` (`#flip-prev`, `#page-indicator`, `#flip-next`); closes shell.
- Three throwaway placeholder pages for now: `cover.html` (hard, `data-density="hard"`), one dummy content page, `back-cover.html` (hard). Convention established here: `<div class="page" data-section="…"><div class="page-inner">…</div></div>`.
- `portfolio/js/components/book.js` (new):
  ```js
  var pageFlip = new St.PageFlip(document.getElementById('book'), {
    width: 550, height: 720, size: 'stretch',
    minWidth: 315, maxWidth: 1100, minHeight: 420, maxHeight: 1350,
    showCover: true, usePortrait: true,
    maxShadowOpacity: 0.35, flippingTime: 700,
    mobileScrollSupport: false,
    useMouseEvents: false   // critical: don't swallow form/kanban events
  });
  pageFlip.loadFromHTML(document.querySelectorAll('#book .page'));
  ```
  TOC click → `flip(n)`; prev/next buttons + arrow keys (skipped when focus is in input/select/textarea); `on('flip')` → highlight TOC via `data-section` of visible page(s) (index and index+1 in landscape), update `#page-indicator`.
- `portfolio.sh`: add `<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>` after jQuery; body = shell-open + page loop + shell-close + toast-container; load `book.js` first. Comment out the old hero/nav/section fragments and their scripts (`nav.js`, `scrollReveal.js`) — deleted for real in Bullet 4.
- Minimal CSS appended to `styles.css`: `.app-shell` flex layout, sidebar (ink background, acid active link — old sticky-nav aesthetic rotated vertical), `.book-area`, bare `.page` skin (cream, 2px ink border). No positioning/margins on `#book .page` — StPageFlip owns that via its `.stf__item` wrappers.

**Verify:** `bash portfolio.sh && python3 -m http.server 8000 --directory portfolio` → book renders, TOC/arrows/keyboard flip, indicator and highlight sync. *If the engine misbehaves, we find out here with 3 pages, not 12.*

## Bullet 2 — Riskiest components inside real pages (proves interactivity survives)

Port the two components most likely to break inside a 3D-transformed book, plus one scroll-trigger conversion:

- `kanban.html` → one `.page` (keep all IDs; strip `.section` wrapper and `reveal` classes). Verify jQuery UI drag-drop between all 3 columns **on both halves of a spread** (`kanban.js` already uses `appendTo:'body'` + `helper:'clone'`, which should escape the transformed subtree — this bullet confirms it). Fallback if broken: z-index-bumped original helper or click-to-move.
- `form.html` → one `.page`. Verify typing, focus, select dropdown, validation, submit progress.
- `counters.html` → one `.page`. Edit `counters.js`: remove its `$(window).on('scroll',…)` trigger; `book.js`'s flip handler calls `animateCounters()` when the stats page becomes visible. Verify animation fires on flip + replay button.

**Verify:** all three components fully functional inside the book. *This bullet retires the project's biggest unknowns; everything after is routine.*

## Bullet 3 — Full page set (content redesign)

Port the remaining sections as magazine pages, same conventions (keep inner IDs, strip `reveal`):

| Fragment | Pages | Notes |
|---|---|---|
| `cover.html` | replace placeholder | Magazine cover from hero: Bebas masthead "OLAYINKA", strapline, `$` motif; drop the scroll-CTA `onclick` |
| `intro.html` (new) | 1 | hero-sub + "how to read" colophon; keeps page count even |
| `filter.html` | 1 | as-is content |
| `accordion.html` → `accordion-1.html` + `accordion-2.html` | 2 | 2 FAQ items each; `accordion.js` unchanged; `slideDown` scrolls inside `.page-body` |
| `search.html` | 1 | `#search-results` max-height + `overflow-y:auto` |
| `tabs.html` | 1 | as-is |
| `slider.html` | 1 | keep component; remove auto-advance timer in `slider.js` (hidden pages keep timers running) |
| `back-cover.html` | replace placeholder | footer content, inverted ink/cream |

Final order in `portfolio.sh` loop: `cover intro counters filter form accordion-1 accordion-2 search kanban tabs slider back-cover` → 12 pages (0 cover … 11 back cover), clean spreads. Update TOC `data-page` indices to match.

Page-skin CSS fleshed out: `.page-inner { height:100%; padding:28px 32px; overflow:hidden; display:flex; flex-direction:column }`; compact `.page-header` (section-num + Bebas title); `.page-num` corner in DM Mono; hard pages inverted; `.page-body { flex:1; overflow-y:auto }` safety valve on accordion/search; component compaction (form field spacing, kanban card padding).

**Verify:** every TOC entry lands on the right spread; every component works in place; nothing overflows its page; toasts overlay the book.

## Bullet 4 — Mobile drawer + cleanup

- CSS ≤768px: `#menu-toggle` (brutalist square, fixed top-left) visible; `.sidebar` becomes fixed drawer (`translateX(-100%)` → `.open`) + scrim; `.book-area` padding shrinks. StPageFlip's `usePortrait` gives single-page mode automatically.
- `book.js`: hamburger toggles drawer; TOC click closes it.
- Delete dead code: `components/hero.html`, `components/nav.html`, `components/footer.html`, `js/components/nav.js`, `js/utils/scrollReveal.js`; drop `#hero*`, `#sticky-nav`, `.section` padding, `.reveal`, old footer rules and obsolete 768px lines from `styles.css`; remove commented-out lines from `portfolio.sh`.

**Verify:** devtools 390×844 — portrait single-page book, drawer opens/closes, TOC flip works, kanban touch drag (existing touch shim) works; desktop still clean; no console errors.

## Bullet 5 — Deploy

- `./deploy.sh` (unchanged) → re-test everything at https://mrpeski.github.io/verbose-spork/ on desktop + a real phone if available.

---

Each bullet ends green before the next begins; commit per bullet (plain messages, no co-author line).
