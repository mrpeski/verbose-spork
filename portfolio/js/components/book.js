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
  maxShadowOpacity: 0.35,
  flippingTime: 700,
  mobileScrollSupport: false,
  useMouseEvents: false
});

pageFlip.loadFromHTML(document.querySelectorAll('#book .page'));

function syncBookUI(idx) {
  if (typeof idx !== 'number') idx = pageFlip.getCurrentPageIndex();
  var total = pageFlip.getPageCount();
  $('#page-indicator').text((idx + 1) + ' / ' + total);

  // Visible page indices. With showCover the cover sits alone and spreads
  // pair up at odd indices: [0], [1,2], [3,4], … in landscape.
  var pages = $('#book .page');
  var visibleIdx;
  if (pageFlip.getOrientation() !== 'landscape' || idx === 0) {
    visibleIdx = [idx];
  } else if (idx % 2 === 1) {
    visibleIdx = idx + 1 < total ? [idx, idx + 1] : [idx];
  } else {
    visibleIdx = [idx - 1, idx];
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
syncBookUI();

// TOC navigation
$('#toc a[data-page]').on('click', function () {
  pageFlip.flip(+$(this).data('page'));
  $('.sidebar').removeClass('open');
});

// Arrow buttons
$('#flip-prev').on('click', function () { pageFlip.flipPrev(); });
$('#flip-next').on('click', function () { pageFlip.flipNext(); });

// Keyboard navigation (ignored while typing in a field)
$(document).on('keydown', function (e) {
  if ($(e.target).is('input, textarea, select')) return;
  if (e.key === 'ArrowLeft') pageFlip.flipPrev();
  if (e.key === 'ArrowRight') pageFlip.flipNext();
});

// Mobile drawer
$('#menu-toggle').on('click', function () { $('.sidebar').addClass('open'); });
$('#sidebar-scrim').on('click', function () { $('.sidebar').removeClass('open'); });
