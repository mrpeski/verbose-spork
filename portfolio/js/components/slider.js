var currentSlide = 0;
var totalSlides = $('#slider-track .slide').length;

function goToSlide(idx) {
  currentSlide = (idx + totalSlides) % totalSlides;
  $('#slider-track').css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
  $('.dot').removeClass('active');
  $('.dot[data-idx="' + currentSlide + '"]').addClass('active');
}

// No auto-advance: hidden book pages keep timers running, so the slider
// only moves on explicit input.
$('#slide-next').on('click', function () { goToSlide(currentSlide + 1); });
$('#slide-prev').on('click', function () { goToSlide(currentSlide - 1); });
$('.dot').on('click', function () { goToSlide(parseInt($(this).data('idx'))); });
