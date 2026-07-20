function applyFilter(filter, animate) {
  $('.portfolio-item').each(function (i) {
    var $item = $(this);
    if ($item.data('cat') === filter) {
      animate ? $item.delay(i * 30).fadeIn(200) : $item.show();
    } else {
      animate ? $item.fadeOut(150) : $item.hide();
    }
  });
}

$('.filter-btn').on('click', function () {
  var filter = $(this).data('filter');
  $('.filter-btn').removeClass('active');
  $(this).addClass('active');
  applyFilter(filter, true);
});

applyFilter($('.filter-btn.active').data('filter'), false);