function animateCounters() {
  $('.counter-num').each(function () {
    var $el = $(this);
    var target = parseInt($el.data('target'));
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
$(window).on('scroll', function () {
  if (!counterFired && $('#s1').offset().top < $(window).scrollTop() + $(window).height() - 100) {
    counterFired = true;
    animateCounters();
  }
});

$('#trigger-counter').on('click', function () {
  counterFired = true;
  animateCounters();
  showToast('Counters replayed!', '🔢');
});