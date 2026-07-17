function showToast(msg, icon) {
  icon = icon || '⚡';
  var $t = $('<div class="toast">')
    .html('<span class="toast-icon">' + icon + '</span><span>' + msg + '</span><span class="toast-close">✕</span>');
  $('#toast-container').append($t);
  setTimeout(function () { $t.addClass('show'); }, 10);
  var timer = setTimeout(function () { closeToast($t); }, 4000);
  $t.find('.toast-close').on('click', function () { clearTimeout(timer); closeToast($t); });
}

function closeToast($t) {
  $t.removeClass('show');
  setTimeout(function () { $t.remove(); }, 350);
}
