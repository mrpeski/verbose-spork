var navShown = false;
$(window).on('scroll', function () {
  var heroH = $('#hero').outerHeight();
  if ($(this).scrollTop() > heroH && !navShown) {
    $('#sticky-nav').css('transform', 'translateY(-100%)').show()
      .animate({ queue: false }, 10)
      .css('transition', 'transform 0.4s ease')
      .css('transform', 'translateY(0)');
    navShown = true;
  } else if ($(this).scrollTop() <= heroH && navShown) {
    $('#sticky-nav').css('transform', 'translateY(-100%)');
    navShown = false;
  }
});

// Active nav highlight
$(window).on('scroll', function () {
  var pos = $(this).scrollTop() + 100;
  $('section[id]').each(function () {
    var top = $(this).offset().top, bot = top + $(this).outerHeight();
    var id = '#' + $(this).attr('id');
    if (pos >= top && pos < bot) {
      $('#sticky-nav a').removeClass('active');
      $('#sticky-nav a[href="' + id + '"]').addClass('active');
    }
  });
});