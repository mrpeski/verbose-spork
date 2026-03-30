function checkReveal() {
  $('.reveal').each(function () {
    if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 60) {
      $(this).addClass('visible');
    }
  });
}
$(window).on('scroll', checkReveal);
checkReveal();