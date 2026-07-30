/* Reader-mode–independent book UI.
   Owns everything that looks the same whichever way pages are navigated:
   the folio indicator, spread classes, TOC active state, the
   `book:pagevisible` event, the drawer, and keyboard nav.

   Navigation itself belongs to a driver — book-flip.js (StPageFlip, the
   signature 3D magazine) on tablet/desktop, book-snap.js (a full-bleed
   scroll-snap carousel) on phones. Exactly one loads its logic, and it
   publishes the global `flipTo` plus a `Reader` object. Consumers
   (deep-link.js, counters.js) only ever see this seam, so they don't
   know or care which driver is running. */

// The mobile driver takes over below this width. Kept as one string so
// the media query and the resize guard below can't drift apart.
var READER_MOBILE_QUERY = '(max-width: 767px)';
var READER_MODE = window.matchMedia(READER_MOBILE_QUERY).matches ? 'snap' : 'flip';

// Lets copy address the reader the visitor actually has — telling a phone
// user to press the ← → buttons is wrong once they're hidden.
document.documentElement.classList.add('reader-' + READER_MODE);

// Small sound pools so rapid TOC riffles overlap instead of cutting each
// other off. Play attempts before the first user gesture (the auto-open
// flip) are blocked by autoplay policy — the catch swallows that
// rejection. Lives here rather than in a driver because kanban.js loads
// after the book and calls it too.
function makeSoundPool(src) {
  var pool = [], i = 0;
  for (var n = 0; n < 3; n++) {
    var a = new Audio(src);
    a.preload = 'auto';
    a.volume = 0.7;
    pool.push(a);
  }
  return function () {
    var a = pool[i++ % pool.length];
    a.currentTime = 0;
    var p = a.play();
    if (p && p.catch) p.catch(function () {});
  };
}

var BookUI = (function () {
  // Reflect a set of visible page indices into the chrome. Drivers call
  // this whenever the visible spread changes — one index in portrait or
  // snap mode, two for a landscape spread.
  function setVisible(visibleIdx) {
    var $pages = $('#book .page');
    var total = $pages.length;

    // Covers are uncounted: inner pages are numbered 1..total-2 (index == folio).
    var innerTotal = total - 2;
    var folios = visibleIdx.filter(function (i) { return i > 0 && i < total - 1; });
    $('#page-indicator').text(
      folios.length
        ? folios.join('–') + ' / ' + innerTotal
        : (visibleIdx[0] === 0 ? 'Cover' : 'Back cover')
    );

    // Spine treatment only applies to a real two-page spread
    $('#book').toggleClass('book--spread', visibleIdx.length === 2);
    $pages.removeClass('page--left page--right');
    if (visibleIdx.length === 2) {
      $pages.eq(visibleIdx[0]).addClass('page--left');
      $pages.eq(visibleIdx[1]).addClass('page--right');
    }

    var visible = visibleIdx.map(function (i) { return $pages.eq(i).data('section'); });

    $('#toc a').removeClass('active');
    $('#toc a[data-page]').each(function () {
      var target = +$(this).data('page');
      var section = $pages.eq(target).data('section');
      if (visible.indexOf(section) !== -1) $(this).addClass('active');
    });

    $(document).trigger('book:pagevisible', [visible]);
  }

  return { setVisible: setVisible };
})();

// ── Navigation chrome ──
// These call through the globals rather than capturing them, so
// deep-link.js's later wrapper of `flipTo` is picked up at click time.

$('#toc a[data-page]').on('click', function () {
  flipTo(+$(this).data('page'));
  $('.sidebar').removeClass('open');
});

$('#flip-prev').on('click', function () { Reader.prev(); });
$('#flip-next').on('click', function () { Reader.next(); });

// Keyboard navigation (ignored while typing in a field)
$(document).on('keydown', function (e) {
  if (e.key === 'Escape') { $('.sidebar').removeClass('open'); return; }
  if ($(e.target).is('input, textarea, select')) return;
  if (e.key === 'ArrowLeft') Reader.prev();
  if (e.key === 'ArrowRight') Reader.next();
});

// Mobile drawer
$('#menu-toggle').on('click', function () { $('.sidebar').addClass('open'); });
$('#sidebar-scrim').on('click', function () { $('.sidebar').removeClass('open'); });

// Crossing the breakpoint swaps the entire reader, and re-initialising
// StPageFlip mid-session reliably mis-sizes the block. Reloading is the
// honest cheap fix: deep-link.js keeps ?section= current, so the reader
// comes back where it was. Only fires on a real mode change (rotation),
// not on the address-bar resizes that fire constantly on mobile.
var reloadingForModeChange = false;
$(window).on('resize', function () {
  if (reloadingForModeChange) return;
  var nowSnap = window.matchMedia(READER_MOBILE_QUERY).matches;
  if (nowSnap === (READER_MODE === 'snap')) return;
  reloadingForModeChange = true;
  location.reload();
});
