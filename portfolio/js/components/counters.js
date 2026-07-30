function animateCounters() {
  $('.counter-num').each(function () {
    var $el = $(this);
    var target = parseInt($el.data('target'));
    // Reduced motion still wants the number, just not the two-second
    // count-up to reach it.
    if (PREFERS_REDUCED_MOTION) {
      $el.text(target.toLocaleString());
      return;
    }
    $el.text('0');
    $({ value: 0 }).animate({ value: target }, {
      duration: 2000,
      easing: 'swing',
      step: function () {
        $el.text(Math.floor(this.value).toLocaleString());
      },
      complete: function () {
        $el.text(target.toLocaleString());
      }
    });
  });
}

var counterFired = false;
// Fired by book.js whenever the visible spread changes
$(document).on('book:pagevisible', function (e, sections) {
  if (!counterFired && sections.indexOf('stats') !== -1) {
    counterFired = true;
    animateCounters();
  }
});

$('#trigger-counter').on('click', function () {
  counterFired = true;
  animateCounters();
  showToast('Counters replayed!', '🔢');
});