$('.accordion-header').on('click', function () {
  var $item = $(this).closest('.accordion-item');
  var isOpen = $item.hasClass('open');
  $('.accordion-item').removeClass('open').find('.accordion-body').slideUp(280);
  if (!isOpen) {
    $item.addClass('open').find('.accordion-body').slideDown(280);
  }
});