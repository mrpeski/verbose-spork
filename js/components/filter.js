$('.filter-btn').on('click', function () {
  var filter = $(this).data('filter');
  $('.filter-btn').removeClass('active');
  $(this).addClass('active');

  if (filter === 'all') {
    $('.portfolio-item').each(function (i) {
      $(this).delay(i * 40).fadeIn(200);
    });
  } else {
    $('.portfolio-item').each(function (i) {
      if ($(this).data('cat') === filter) {
        $(this).delay(i * 30).fadeIn(200);
      } else {
        $(this).fadeOut(150);
      }
    });
  }
});