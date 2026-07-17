function updateCounts() {
  $('#cnt-backlog').text($('#col-backlog .kanban-card').length);
  $('#cnt-progress').text($('#col-progress .kanban-card').length);
  $('#cnt-done').text($('#col-done .kanban-card').length);
}

$('.kanban-card').draggable({
  revert: 'invalid',
  helper: 'clone',
  appendTo: 'body',
  zIndex: 1000,
  opacity: 0.85,
  cursor: 'grabbing',
  start: function (e, ui) {
    ui.helper.css('width', $(this).outerWidth());
    $(this).css('opacity', 0.4);
  },
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

// jQuery UI only listens for mouse events; translate touches so the board
// is draggable on phones/tablets too.
(function () {
  if (!('ontouchstart' in window)) return;

  function simulate(e, type) {
    var touch = e.originalEvent.changedTouches[0];
    var ev = new MouseEvent(type, {
      bubbles: true, cancelable: true, view: window,
      screenX: touch.screenX, screenY: touch.screenY,
      clientX: touch.clientX, clientY: touch.clientY,
      button: 0
    });
    e.target.dispatchEvent(ev);
  }

  $(document).on('touchstart', '.kanban-card', function (e) {
    e.preventDefault();
    simulate(e, 'mousedown');
    $(document)
      .on('touchmove.kanbanDrag', function (me) {
        me.preventDefault();
        simulate(me, 'mousemove');
      })
      .on('touchend.kanbanDrag touchcancel.kanbanDrag', function (ue) {
        simulate(ue, 'mouseup');
        $(document).off('.kanbanDrag');
      });
  });
})();