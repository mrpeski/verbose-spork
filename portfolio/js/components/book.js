/* Flipbook engine + TOC sync (StPageFlip) */
var pageFlip = new St.PageFlip(document.getElementById('book'), {
  width: 550,
  height: 720,
  size: 'stretch',
  minWidth: 315,
  maxWidth: 1100,
  minHeight: 420,
  maxHeight: 1350,
  showCover: true,
  usePortrait: true,
  maxShadowOpacity: 0.5,
  flippingTime: 300,
  mobileScrollSupport: false,
  useMouseEvents: true,
  disableFlipByClick: false,
  showPageCorners: false
});

pageFlip.loadFromHTML(document.querySelectorAll('#book .page'));

var FLIP_MS = 300; // keep in sync with flippingTime above
var FLIP_CORNER = 'bottom';
var interactiveSelector = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '.accordion-header',
  '.filter-btn',
  '.kanban-card',
  '.kanban-list',
  '.slider-dot',
  '.slider-btn',
  '.tab-btn'
].join(',');

// StPageFlip reads flippingTime from its settings at each animation start,
// so mutating it retunes the very next flip.
function setFlipSpeed(ms) { pageFlip.getSettings().flippingTime = ms; }

// Dress the incoming spread (spine borders, folio side) before the leaf
// starts turning. The 'flip' event only fires when the animation lands,
// so without this the newly revealed page visibly snapped into its
// spread styling a beat after settling. Old classes are left in place —
// syncBookUI clears them on landing, and mid-flight overlap is harmless.
function primeSpread(target) {
  var vis = visibleIndices(target);
  if (vis.length !== 2) return;
  var pages = $('#book .page');
  pages.eq(vis[0]).addClass('page--left');
  pages.eq(vis[1]).addClass('page--right');
}

function flipNextPage() {
  var step = pageFlip.getOrientation() === 'landscape' ? 2 : 1;
  primeSpread(Math.min(pageFlip.getCurrentPageIndex() + step, pageFlip.getPageCount() - 1));
  pageFlip.flipNext(FLIP_CORNER);
}
function flipPrevPage() {
  var step = pageFlip.getOrientation() === 'landscape' ? 2 : 1;
  primeSpread(Math.max(pageFlip.getCurrentPageIndex() - step, 0));
  pageFlip.flipPrev(FLIP_CORNER);
}

$('.page').on('mousedown touchstart pointerdown click', interactiveSelector, function(e) {
  e.stopPropagation();
});

// Visible page indices. With showCover the cover sits alone and spreads
// pair up at odd indices: [0], [1,2], [3,4], … in landscape.
function visibleIndices(idx) {
  var total = pageFlip.getPageCount();
  if (pageFlip.getOrientation() !== 'landscape' || idx === 0) return [idx];
  if (idx % 2 === 1) return idx + 1 < total ? [idx, idx + 1] : [idx];
  return [idx - 1, idx];
}

// Walk spread by spread to a target page instead of jumping straight there.
// Speed scales with remaining distance: a fast riffle while far away,
// easing back to a regular flip as the book lands on the target.
var flipSeq = 0;
function flipTo(target) {
  var seq = ++flipSeq;
  var prev = -1;
  (function step() {
    if (seq !== flipSeq) return;
    var idx = pageFlip.getCurrentPageIndex();
    if (idx === prev || visibleIndices(idx).indexOf(target) !== -1) {
      setFlipSpeed(FLIP_MS); // done (or edge reached) — restore normal speed
      return;
    }
    prev = idx;
    var spreadsLeft = Math.ceil(Math.abs(target - idx) / 2);
    var speed = spreadsLeft >= 3 ? 110 : spreadsLeft === 2 ? 180 : FLIP_MS;
    setFlipSpeed(speed);
    if (target > idx) flipNextPage(); else flipPrevPage();
    setTimeout(step, speed + 60);
  })();
}

function syncBookUI(idx) {
  if (typeof idx !== 'number') idx = pageFlip.getCurrentPageIndex();
  var total = pageFlip.getPageCount();
  var pages = $('#book .page');
  var visibleIdx = visibleIndices(idx);

  // Covers are uncounted: inner pages are numbered 1..total-2 (index == folio).
  var innerTotal = total - 2;
  var folios = visibleIdx.filter(function (i) { return i > 0 && i < total - 1; });
  $('#page-indicator').text(
    folios.length
      ? folios.join('–') + ' / ' + innerTotal
      : (visibleIdx[0] === 0 ? 'Cover' : 'Back cover')
  );

  // Spine treatment only applies to a real two-page spread
  pages.removeClass('page--left page--right');
  if (visibleIdx.length === 2) {
    pages.eq(visibleIdx[0]).addClass('page--left');
    pages.eq(visibleIdx[1]).addClass('page--right');
  }

  var visible = visibleIdx.map(function (i) { return pages.eq(i).data('section'); });

  $('#toc a').removeClass('active');
  $('#toc a[data-page]').each(function () {
    var target = +$(this).data('page');
    var section = pages.eq(target).data('section');
    if (visible.indexOf(section) !== -1) $(this).addClass('active');
  });

  $(document).trigger('book:pagevisible', [visible]);
}

pageFlip.on('flip', function (e) { syncBookUI(e.data); });
pageFlip.on('changeOrientation', function () { syncBookUI(); });
syncBookUI();

// Open the magazine on arrival: flip past the cover to the first spread,
// unless the visitor has already started reading on their own.
setTimeout(function () {
  if (pageFlip.getCurrentPageIndex() === 0) flipNextPage();
}, 500);

// TOC navigation
$('#toc a[data-page]').on('click', function () {
  flipTo(+$(this).data('page'));
  $('.sidebar').removeClass('open');
});

// Arrow buttons (cancel any TOC walk in progress, back to normal speed)
$('#flip-prev').on('click', function () { flipSeq++; setFlipSpeed(FLIP_MS); flipPrevPage(); });
$('#flip-next').on('click', function () { flipSeq++; setFlipSpeed(FLIP_MS); flipNextPage(); });

// Keyboard navigation (ignored while typing in a field)
$(document).on('keydown', function (e) {
  if (e.key === 'Escape') { $('.sidebar').removeClass('open'); return; }
  if ($(e.target).is('input, textarea, select')) return;
  if (e.key === 'ArrowLeft') { flipSeq++; setFlipSpeed(FLIP_MS); flipPrevPage(); }
  if (e.key === 'ArrowRight') { flipSeq++; setFlipSpeed(FLIP_MS); flipNextPage(); }
});

// Mobile drawer
$('#menu-toggle').on('click', function () { $('.sidebar').addClass('open'); });
$('#sidebar-scrim').on('click', function () { $('.sidebar').removeClass('open'); });
