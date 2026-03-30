#!/bin/bash

# Build script to assemble index.html from components

echo "Building index.html from components..."
THEME=$1

# Create the basic structure
cat >index.html <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>jQuery Mastery — Interactive Showcase</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,700;1,300&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<link rel="stylesheet" href="css/styles.css">
</head>
<body class="theme-${THEME}">
HTML

# Add hero section
cat components/hero.html >>index.html

# Add nav section
cat components/nav.html >>index.html

# Add demos wrapper opening
echo '<div id="demos">' >>index.html

# Add all demo sections
cat components/counters.html >>index.html
cat components/filter.html >>index.html
cat components/form.html >>index.html
cat components/accordion.html >>index.html
cat components/search.html >>index.html
cat components/kanban.html >>index.html
cat components/tabs.html >>index.html
cat components/slider.html >>index.html

# Add demos wrapper closing
echo '</div>' >>index.html

# Add footer
cat components/footer.html >>index.html

# Add toast container
cat components/toast-container.html >>index.html

# Add external scripts
cat >>index.html <<'JS'
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>
<script src="js/utils/toast.js"></script>
<script src="js/utils/scrollReveal.js"></script>
<script src="js/components/nav.js"></script>
<script src="js/components/counters.js"></script>
<script src="js/components/filter.js"></script>
<script src="js/components/form.js"></script>
<script src="js/components/accordion.js"></script>
<script src="js/components/search.js"></script>
<script src="js/components/kanban.js"></script>
<script src="js/components/tabs.js"></script>
<script src="js/components/slider.js"></script>
</body>
</html>
JS

echo "Build complete! index.html has been assembled from components."
