var skills = [
  { name: 'jQuery', meta: 'DOM manipulation · Events · AJAX', icon: '⚡' },
  { name: 'JavaScript ES6+', meta: 'Async/Await · Modules · Closures', icon: '🟨' },
  { name: 'HTML5 / CSS3', meta: 'Semantic markup · Flexbox · Grid', icon: '🌐' },
  { name: 'React', meta: 'Hooks · Context · Performance', icon: '⚛️' },
  { name: 'Node.js', meta: 'Express · REST APIs · Middleware', icon: '🟢' },
  { name: 'Python', meta: 'Flask · Django · Data scripting', icon: '🐍' },
  { name: 'MySQL / PostgreSQL', meta: 'Queries · Indexing · Migrations', icon: '🗄️' },
  { name: 'MongoDB', meta: 'NoSQL · Aggregations · Mongoose', icon: '🍃' },
  { name: 'Git / GitHub', meta: 'Branching · PRs · CI workflows', icon: '🔀' },
  { name: 'Figma', meta: 'UI Design · Prototyping · Handoff', icon: '🎨' },
  { name: 'Performance Optimization', meta: 'Lazy load · Code split · Caching', icon: '🚀' },
  { name: 'Responsive Design', meta: 'Mobile-first · Breakpoints · REM', icon: '📐' }
];

function renderResults(term) {
  var $r = $('#search-results').empty();
  var $cnt = $('#search-count');
  var filtered = !term ? skills : skills.filter(function (s) {
    return s.name.toLowerCase().includes(term) || s.meta.toLowerCase().includes(term);
  });
  $cnt.text(filtered.length + ' result' + (filtered.length !== 1 ? 's' : '') + (term ? ' for "' + term + '"' : ''));
  if (!filtered.length) {
    $r.append('<p class="search-empty">No skills matched.</p>');
    return;
  }
  $.each(filtered, function (i, s) {
    var nameHtml = term ? s.name.replace(new RegExp('(' + $.escapeSelector(term) + ')', 'gi'), '<span class="highlight">$1</span>') : s.name;
    var $item = $('<div class="search-result-item">')
      .html('<div class="result-icon">' + s.icon + '</div><div><div class="result-name">' + nameHtml + '</div><div class="result-meta">' + s.meta + '</div></div>');
    $r.append($item.hide().delay(i * 30).fadeIn(180));
  });
}

renderResults('');

var searchDebounce;
$('#search-input').on('keyup input', function () {
  clearTimeout(searchDebounce);
  var val = $(this).val().trim().toLowerCase();
  searchDebounce = setTimeout(function () { renderResults(val); }, 180);
});