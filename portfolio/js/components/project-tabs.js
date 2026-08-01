$('.proj-tab-btn').on('click', function () {
  var tab = $(this).data('tab');
  $('.proj-tab-btn').removeClass('active');
  $(this).addClass('active');
  $('.proj-tab-pane').removeClass('active').hide();
  $('#ptab-' + tab).addClass('active').show();
});
