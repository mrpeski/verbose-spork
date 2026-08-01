/* Reader driver: the StPageFlip 3D magazine (tablet/desktop).
   Publishes the global `flipTo` and `Reader`; all shared chrome lives in
   book-ui.js. Inert when book-ui.js selected the snap driver. */

if (READER_MODE === 'flip') (function () {

var bookEl = document.getElementById('book');

// Fit #book so StPageFlip's block is exactly two pages wide (one in
// portrait). With size:'stretch' the engine derives page size from the
// available height when that's the tighter constraint, then centres the
// resting pages inside the leftover block width — but it still animates
// flips against the block's half-width, so a turning leaf hovered short
// of the spine and snapped across the gap on landing.
function sizeBook() {
  var area = document.querySelector('.book-area');
  var controls = document.querySelector('.book-controls');
  var cs = getComputedStyle(area);
  var availW = Math.min(
    area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
    1100
  );
  // Read the controls' margin rather than hardcoding it — it comes from
  // the spacing scale now, and a stale copy here silently mis-sizes the
  // book by the difference.
  var controlsGap = parseFloat(getComputedStyle(controls).marginTop) || 0;
  var availH = area.clientHeight
    - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    - controls.offsetHeight - controlsGap;
  var pageW = Math.min(availW / 2, availH * 550 / 720);
  var w = pageW * 2;
  if (w < 630) w = Math.min(availW, availH * 550 / 720); // portrait: single page
  bookEl.style.width = Math.max(315, Math.floor(w)) + 'px';
}

var pageFlip = new St.PageFlip(bookEl, {
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

// StPageFlip resets #book's inline width to 100% during init, so the
// fit must be applied after it and re-measured.
sizeBook();
pageFlip.getUI().update();

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

// Both directions use the same sample. Direction-matched audio was tried
// and dropped — the forward sample read as a different object turning,
// not the same page going the other way — so its file is gone too.
var flipSounds = {
  next: makeSoundPool('sounds/flip-backward.mp3'),
  prev: makeSoundPool('sounds/flip-backward.mp3')
};
var lastFlipSoundAt = 0;
function playFlipSound(dir) {
  lastFlipSoundAt = Date.now();
  flipSounds[dir]();
}

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
  // Skip early spread class when starting from cover (left half is empty backdrop)
  if (pageFlip.getCurrentPageIndex() !== 0) $('#book').addClass('book--spread');
}

// Sound only when the engine actually starts a flip. Predicting from the
// page index is unreliable (e.g. portrait mode refuses the flip onto the
// back cover while the index still looks flippable), so the queued
// direction only sounds when 'changeState' reports the animation began —
// a refused flip at the cover/back cover stays silent.
var pendingFlipDir = null, pendingFlipAt = 0;
function queueFlipSound(dir) { pendingFlipDir = dir; pendingFlipAt = Date.now(); }
pageFlip.on('changeState', function (e) {
  if (e.data !== 'flipping') return;
  if (pendingFlipDir && Date.now() - pendingFlipAt < 300) playFlipSound(pendingFlipDir);
  pendingFlipDir = null;
});

function flipNextPage() {
  var step = pageFlip.getOrientation() === 'landscape' ? 2 : 1;
  primeSpread(Math.min(pageFlip.getCurrentPageIndex() + step, pageFlip.getPageCount() - 1));
  queueFlipSound('next');
  pageFlip.flipNext(FLIP_CORNER);
}
function flipPrevPage() {
  var step = pageFlip.getOrientation() === 'landscape' ? 2 : 1;
  primeSpread(Math.max(pageFlip.getCurrentPageIndex() - step, 0));
  queueFlipSound('prev');
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
  BookUI.setVisible(visibleIndices(idx));
}

// Drag/swipe flips never pass through flipNextPage/flipPrevPage, so
// they'd be silent — catch them here on landing. The recency check
// keeps programmatic flips (which already played at start) from
// sounding twice.
var lastFlipIndex = pageFlip.getCurrentPageIndex();
pageFlip.on('flip', function (e) {
  if (Date.now() - lastFlipSoundAt > 450 && e.data !== lastFlipIndex) {
    playFlipSound(e.data > lastFlipIndex ? 'next' : 'prev');
  }
  lastFlipIndex = e.data;
  syncBookUI(e.data);
});
pageFlip.on('changeOrientation', function () { syncBookUI(); });
syncBookUI();

// Re-fit on resize. StPageFlip's own resize listener was attached first
// and reads the block before our width lands, so nudge its UI update
// afterwards to make it re-measure.
$(window).on('resize', function () {
  sizeBook();
  pageFlip.getUI().update();
});

// Open the magazine on arrival: flip past the cover to the first spread,
// unless the visitor has already started reading on their own. The flip
// runs slower than a reader-initiated one — at 300ms the cover pops to a
// visible angle on its very first frame, which reads as a jump when
// nothing prompted it.
var OPEN_MS = 900;
setTimeout(function () {
  // Nothing prompted this flip, so it is exactly the kind of motion
  // reduced-motion asks us not to start.
  if (PREFERS_REDUCED_MOTION) return;
  if (pageFlip.getCurrentPageIndex() !== 0) return;
  setFlipSpeed(OPEN_MS);
  flipNextPage();
  setTimeout(function () { setFlipSpeed(FLIP_MS); }, OPEN_MS + 50);
}, 500);

// Publish the reader seam. book-ui.js binds the arrows and keyboard to
// Reader; deep-link.js wraps the global flipTo.
window.flipTo = flipTo;
window.Reader = {
  goTo: flipTo,
  next: function () { flipSeq++; setFlipSpeed(FLIP_MS); flipNextPage(); },
  prev: function () { flipSeq++; setFlipSpeed(FLIP_MS); flipPrevPage(); }
};

})();
