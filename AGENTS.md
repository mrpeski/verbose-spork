# AGENTS.md

## What this repo is

Two static, hand-written sites built by concatenating HTML fragments with
bash. There is **no package.json, no npm, no bundler, no TypeScript, no
linter and no test suite** — do not add or assume any of them.

| Site | Build | Components | Output |
|---|---|---|---|
| **Portfolio** (the live one) | `bash portfolio.sh [theme]` | `portfolio/components/` | `portfolio/index.html` |
| **jQuery showcase** (older demo) | `bash build.sh [theme]` | `components/` | `index.html` (gitignored) |

`deploy.sh [theme]` rebuilds the portfolio, copies `portfolio/` into a temp
dir, and **force-pushes it to the `gh-pages` branch**. Run it only when
explicitly asked.

## The one rule that matters

**Never edit `portfolio/index.html` or the root `index.html`.** Both are
generated — the next build silently discards your work. Edit the fragments
in `portfolio/components/` (or `components/`) and rebuild.

`portfolio/index.html` is committed (GitHub Pages serves `portfolio/` as the
site root), so rebuild and commit it alongside any component change. The
root `index.html` is gitignored.

## Layout

```
portfolio/
  components/*.html   # page fragments, concatenated in portfolio.sh's loop
  css/styles.css      # the entire stylesheet
  js/components/*.js  # one file per widget, plain <script> tags
  js/utils/toast.js
  sounds/*.mp3
  data/resume.md      # source of truth for career content
```

Page order and the TOC `data-page` indices in `components/shell-open.html`
must stay in sync with the component loop in `portfolio.sh`.

## How the JavaScript works

Plain ES5-era browser scripts loaded with `<script src>` in dependency
order. **No modules, no imports, no build step.** Top-level `var` and
`function` declarations are globals, and files genuinely depend on that:

- `book-ui.js` picks the reader mode and publishes `BookUI`, `makeSoundPool`,
  `Sound` and `PREFERS_REDUCED_MOTION`. It must load before both drivers.
- `book-flip.js` (StPageFlip magazine, ≥768px) and `book-snap.js`
  (scroll-snap carousel, <768px) each activate for one mode and publish the
  global `flipTo` plus a `Reader` object.
- `deep-link.js` wraps the global `flipTo` and listens for `book:pagevisible`.
- `counters.js` listens for `book:pagevisible`; `kanban.js` calls
  `makeSoundPool`.

So: **script order in `portfolio.sh` is load-bearing.** Adding a file means
adding a `<script>` tag to that heredoc.

The breakpoint lives in two places that must agree — `READER_MOBILE_QUERY`
in `book-ui.js` and the `@media (max-width: 767px)` block in `styles.css`.

## CSS conventions

- One stylesheet, no nesting, no `@layer`.
- **Values come from tokens, not from taste.** `:root` defines the palette,
  a semantic colour layer, a 4px spacing scale (`--s1`…`--s9`), radii,
  elevation, motion, and a fluid type scale (`--fs-*`, named for their
  desktop pixel size).
- Components reference the **semantic** names (`--bg`, `--text`, `--line`,
  `--accent`, `--surface-inverse`…), never the raw palette (`--ink`,
  `--cream`, `--acid`…). The semantic block is declared on every theme
  selector so it re-resolves per theme — do not move it back to `:root`
  alone or the themes stop working.
- Hover states go inside `@media (hover: hover) and (pointer: fine)` so
  they do not stick after a tap.
- Interactive elements need a 44px minimum hit area, and form fields need
  16px text on touch; see the `TOUCH TARGETS` block at the foot of the
  stylesheet.

## Style

Match the surrounding code: `var`, `function`, jQuery, two-space indents.
Comments explain *why* — several document real browser bugs that were
worked around, so read them before "simplifying" them away.

## Verifying a change

```bash
bash portfolio.sh
python3 -m http.server 8899        # http://localhost:8899/portfolio/index.html
```

Check both readers — 390×844 (carousel) and 1440×900 (flipbook) — plus the
768/767px boundary. Serve with caching disabled, or the browser will hand
you a stale `index.html`/`styles.css` and you will verify the wrong build.

Themes: `bash portfolio.sh forest|ocean|sunset`, then rebuild the default
with `bash portfolio.sh` before committing.
