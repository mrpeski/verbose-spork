#!/usr/bin/env bash

# Build script for the portfolio site – mirrors the existing build.sh but
# operates on the `portfolio/` sub‑tree. The generated page is written to
# `portfolio/index.html`.

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
<link rel="stylesheet" href="portfolio/css/styles.css">
</head>
<body class=\"theme-${THEME}\">
HTML

# Core sections – you can reorder if you prefer
cat portfolio/components/hero.html    >>"$OUT"
cat portfolio/components/nav.html     >>"$OUT"

echo '<div id="demos">'               >>"$OUT"

# Demo components (same order as the original build)
for comp in counters filter form accordion search kanban tabs slider; do
    cat "portfolio/components/${comp}.html" >>"$OUT"
done

echo '</div>'                        >>"$OUT"
cat portfolio/components/footer.html >>"$OUT"
cat portfolio/components/toast-container.html >>"$OUT"

# External scripts – point to the new js locations
cat >>"$OUT" <<'JS'
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src="portfolio/js/utils/toast.js"></script>
<script src="portfolio/js/utils/scrollReveal.js"></script>
<script src="portfolio/js/components/nav.js"></script>
<script src="portfolio/js/components/counters.js"></script>
<script src="portfolio/js/components/filter.js"></script>
<script src="portfolio/js/components/form.js"></script>
<script src="portfolio/js/components/accordion.js"></script>
<script src="portfolio/js/components/search.js"></script>
<script src="portfolio/js/components/kanban.js"></script>
<script src="portfolio/js/components/tabs.js"></script>
<script src="portfolio/js/components/slider.js"></script>
</body>
</html>
JS

echo "Portfolio build complete! Output written to $OUT"
