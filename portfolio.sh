#!/usr/bin/env bash

# Build script for the portfolio site – concatenates the fragments in
# portfolio/components/ into a magazine-style flipbook page at
# portfolio/index.html.

# Optional theme argument (defaults to "light")
THEME=${1:-light}

# Output file (relative to repo root)
OUT=portfolio/index.html

# Start the HTML document
cat >"$OUT" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Olayinka – Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<link rel="stylesheet" href="css/styles.css">
</head>
<body class="theme-${THEME}">
HTML

# App shell opens (sidebar TOC + book container)
cat portfolio/components/shell-open.html >>"$OUT"

# Book pages, in reading order
for comp in cover intro counters filter form accordion search kanban tabs project-tabs credentials back-cover; do
  cat "portfolio/components/${comp}.html" >>"$OUT"
done

# App shell closes (flip controls)
cat portfolio/components/shell-close.html >>"$OUT"
cat portfolio/components/toast-container.html >>"$OUT"

# External scripts – the book comes first so its globals (makeSoundPool,
# flipTo, the book:pagevisible event) exist for the components. book-ui.js
# picks the reader mode and must precede both drivers; exactly one driver
# activates, and deep-link.js wraps whichever flipTo it published.
cat >>"$OUT" <<'JS'
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src="js/utils/toast.js"></script>
<script src="js/components/book-ui.js"></script>
<script src="js/components/book-flip.js"></script>
<script src="js/components/book-snap.js"></script>
<script src="js/components/counters.js"></script>
<script src="js/components/filter.js"></script>
<script src="js/components/form.js"></script>
<script src="js/components/accordion.js"></script>
<script src="js/components/search.js"></script>
<script src="js/components/kanban.js"></script>
<script src="js/components/tabs.js"></script>
<script src="js/components/project-tabs.js"></script>
<script src="js/components/deep-link.js"></script>
</body>
</html>
JS

echo "Portfolio build complete! Output written to $OUT"
