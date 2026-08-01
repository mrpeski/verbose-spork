/* Reader driver: full-bleed scroll-snap carousel (phones).
   StPageFlip locks a 550:720 aspect, so on a tall phone the width binds
   and the book shrinks vertically — 43% of a 390×844 screen was empty
   backdrop, and every page's content was forced into a nested scroller
   that then fought the swipe-to-flip gesture. Below 768px we drop the 3D
   flip entirely and let the pages be what they already are: a horizontal
   row of full-viewport panels the thumb swipes through.

   Publishes the same `flipTo` / `Reader` seam as book-flip.js, so
   deep-link.js and book-ui.js don't know which driver is running. */

if (READER_MODE === 'snap') (function () {

var bookEl = document.getElementById('book');
var $pages = $('#book .page');
var lastIndex = $pages.length - 1;

// Opts the CSS into carousel layout. Set from JS, not the media query
// alone, so the flipbook stylesheet can never apply to a snapping book
// (and vice versa) if the two ever disagree about the breakpoint.
$(bookEl).addClass('book--snap');

var current = 0;

function goTo(target, behavior) {
  var idx = Math.max(0, Math.min(target, lastIndex));
  var el = $pages.get(idx);
  if (!el) return;
  el.scrollIntoView({
    behavior: behavior || 'smooth',
    inline: 'center',
    block: 'nearest'
  });
}

// Deep links resolve during load, before the reader has settled — a
// smooth scroll there animates from the cover for no reason and races
// the observer. Jump instantly until the first frame is done.
var booted = false;
setTimeout(function () { booted = true; }, 0);

// Smooth only for a neighbouring page, where the animation shows the
// reader which way they moved. A TOC jump across the magazine would
// otherwise crawl through every page in between, firing the observer
// (and a page-turn sound) at each one — the flip driver rides those out
// as a fast riffle, but a snap container has no equivalent, so land
// directly instead.
function flipTo(target) {
  var far = Math.abs(target - current) > 1;
  goTo(target, (booted && !far) ? 'smooth' : 'auto');
}

// One page is "visible" at a time here, so there is never a spread —
// BookUI handles the single-index case and clears the spine classes.
var flipSound = makeSoundPool('sounds/flip-backward.mp3');

function setCurrent(idx) {
  if (idx === current) return;
  current = idx;
  flipSound();
  BookUI.setVisible([idx]);
}

// Which page owns the viewport. Threshold sits above half so the
// crossover happens once, mid-swipe, rather than flickering between two
// pages while both are partly on screen.
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
    setCurrent($pages.index(entry.target));
  });
}, { root: bookEl, threshold: [0, 0.55, 1] });

$pages.each(function () { io.observe(this); });

// Dot row in place of the prev/next arrows — on a swipe surface the
// arrows are redundant, but position within a 12-page magazine isn't
// obvious without them.
var $dots = $('<div class="book-dots" role="tablist" aria-label="Pages"></div>');
$pages.each(function (i) {
  var label = $(this).data('section') || ('Page ' + i);
  $('<button type="button" class="book-dot"></button>')
    .attr('aria-label', String(label))
    .on('click', function () { flipTo(i); })
    .appendTo($dots);
});
$('.book-controls').addClass('book-controls--snap').append($dots);

$(document).on('book:pagevisible', function () {
  $dots.children().each(function (i) {
    $(this).toggleClass('active', i === current);
  });
});

BookUI.setVisible([0]);

window.flipTo = flipTo;
window.Reader = {
  goTo: flipTo,
  next: function () { flipTo(current + 1); },
  prev: function () { flipTo(current - 1); }
};

})();
