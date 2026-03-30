function updateCounts() {
  $('#cnt-backlog').text($('#col-backlog .kanban-card').length);
  $('#cnt-progress').text($('#col-progress .kanban-card').length);
  $('#cnt-done').text($('#col-done .kanban-card').length);
}

$('.kanban-card').draggable({
  revert: 'invalid',
  helper: 'clone',
  zIndex: 1000,
  opacity: 0.85,
  cursor: 'grabbing',
  start: function () { $(this).css('opacity', 0.4); },
  stop: function () { $(this).css('opacity', 1); }
});

$('.kanban-list').droppable({
  accept: '.kanban-card',
  hoverClass: 'ui-droppable-hover',
  drop: function (e, ui) {
    var $card = ui.draggable;
    var $list = $(this);
    $card.css({ top: 0, left: 0, opacity: 1 });
    $list.append($card);
    updateCounts();
    var colName = $list.attr('id').replace('col-', '');
    showToast('Moved to ' + colName.charAt(0).toUpperCase() + colName.slice(1) + '!', '📌');
  }
});