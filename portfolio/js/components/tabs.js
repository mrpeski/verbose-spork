$('.tab-btn').on('click', function () {
  var tab = $(this).data('tab');
  $('.tab-btn').removeClass('active');
  $(this).addClass('active');
  $('.tab-pane').removeClass('active').hide();
  $('#tab-' + tab).addClass('active').show();
});