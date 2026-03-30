var currentSlide = 0;
var totalSlides = $('#slider-track .slide').length;
var autoSlide;

function goToSlide(idx) {
  currentSlide = (idx + totalSlides) % totalSlides;
  $('#slider-track').css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
  $('.dot').removeClass('active');
  $('.dot[data-idx="' + currentSlide + '"]').addClass('active');
}

$('#slide-next').on('click', function () { goToSlide(currentSlide + 1); resetAuto(); });
$('#slide-prev').on('click', function () { goToSlide(currentSlide - 1); resetAuto(); });
$('.dot').on('click', function () { goToSlide(parseInt($(this).data('idx'))); resetAuto(); });

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(function () { goToSlide(currentSlide + 1); }, 5000);
}

resetAuto();