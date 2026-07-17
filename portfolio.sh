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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Olayinka – Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>
<link rel="stylesheet" href="css/styles.css">
</head>
<body class="theme-${THEME}">
HTML

# App shell opens (sidebar TOC + book container)
cat portfolio/components/shell-open.html >>"$OUT"

# Book pages, in reading order
for comp in cover placeholder placeholder-2 back-cover; do
  cat "portfolio/components/${comp}.html" >>"$OUT"
done

# App shell closes (flip controls)
cat portfolio/components/shell-close.html >>"$OUT"
cat portfolio/components/toast-container.html >>"$OUT"

# External scripts – book.js first so flip events exist for the components
cat >>"$OUT" <<'JS'
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src="js/utils/toast.js"></script>
<script src="js/components/book.js"></script>
</body>
</html>
JS

echo "Portfolio build complete! Output written to $OUT"
