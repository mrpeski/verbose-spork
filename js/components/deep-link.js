/* URL query deep-linking: ?section=<slug>&tab=<tab> opens the book at that
   spread/tab, and the URL stays in sync as the visitor navigates by hand. */

function pageIndexForSection(slug) {
  var $page = $('#book .page[data-section="' + slug + '"]');
  return $page.length ? $page.index('.page') : -1;
}

function activateTab($page, tab) {
  $page.find(
    '.proj-tab-btn[data-tab="' + tab + '"], ' +
    '.tab-btn[data-tab="' + tab + '"], ' +
    '.filter-btn[data-filter="' + tab + '"]'
  ).trigger('click');
}

// flipTo() walks page-by-page and only guarantees the target ends up
// *visible*, not that it's the leftmost page of the landing spread — so a
// pagevisible listener can't tell which of the two visible sections the
// walk was actually headed for. Wrap it to remember that intent; consumed
// (and cleared) the first time it's matched below.
var flipToTargetSection = null;
var _flipTo = flipTo;
flipTo = function (idx) {
  flipToTargetSection = $('#book .page').eq(idx).data('section') || null;
  _flipTo(idx);
};

// Open straight to the requested section/tab on load.
(function openFromQuery() {
  var params = new URLSearchParams(location.search);
  var section = params.get('section');
  if (!section) return;
  var idx = pageIndexForSection(section);
  if (idx === -1) return;
  flipTo(idx);
  var tab = params.get('tab');
  if (tab) activateTab($('#book .page').eq(idx), tab);
})();

// Keep ?section= in sync as the visitor flips pages. Landscape spreads show
// two pages at once, so prefer whichever section just came into view (the
// page the visitor is arriving at) over the one that was already showing.
var lastVisibleSections = [];
$(document).on('book:pagevisible', function (e, visibleSections) {
  var visible = visibleSections.filter(Boolean);
  // Mid-walk toward a known flipTo() target: don't churn the URL (and
  // don't drop ?tab=) on the intermediate spreads passed along the way.
  if (flipToTargetSection && visible.indexOf(flipToTargetSection) === -1) {
    lastVisibleSections = visible;
    return;
  }
  var section;
  if (flipToTargetSection) {
    section = flipToTargetSection;
    flipToTargetSection = null;
  } else {
    var justArrived = visible.filter(function (s) { return lastVisibleSections.indexOf(s) === -1; });
    section = justArrived[0] || visible[0];
  }
  lastVisibleSections = visible;
  if (!section) return;
  var params = new URLSearchParams(location.search);
  if (params.get('section') === section) return;
  params.set('section', section);
  params.delete('tab');
  history.replaceState(null, '', '?' + params.toString());
});

// Keep ?tab= in sync as the visitor switches tabs/filters. Delegated on
// '.page' (not document) — book.js stops propagation on button clicks
// inside '.page' at that same level, which would otherwise swallow this
// before it reached a document-level listener.
$('.page').on('click', '.proj-tab-btn, .tab-btn, .filter-btn', function () {
  var tab = $(this).data('tab') || $(this).data('filter');
  if (!tab) return;
  var params = new URLSearchParams(location.search);
  params.set('tab', tab);
  history.replaceState(null, '', '?' + params.toString());
});
