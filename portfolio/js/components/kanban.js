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
  stop: function () {
    $(this).css('opacity', 1);
    // drop() runs before stop(), so a missing flag means the card reverted.
    if ($(this).data('dropped')) {
      $(this).removeData('dropped');
    } else {
      kanbanSounds.revert();
    }
  }
});

// Category sounds escalate with the story a card tells: a soft tick into
// Backlog, rising notes for In Progress, a full resolving chord for Done.
// makeSoundPool comes from book.js (loaded first).
var kanbanSounds = {
  backlog: makeSoundPool('sounds/kanban-backlog.mp3'),
  progress: makeSoundPool('sounds/kanban-progress.mp3'),
  done: makeSoundPool('sounds/kanban-done.mp3'),
  revert: makeSoundPool('sounds/kanban-revert.mp3')
};

$('.kanban-list').droppable({
  accept: '.kanban-card',
  hoverClass: 'ui-droppable-hover',
  drop: function (e, ui) {
    var $card = ui.draggable;
    $card.data('dropped', true);
    var $list = $(this);
    var changedColumn = $card.closest('.kanban-list').attr('id') !== $list.attr('id');
    $card.css({ top: 0, left: 0, opacity: 1 });
    $list.append($card);
    updateCounts();
    var colName = $list.attr('id').replace('col-', '');
    if (changedColumn && kanbanSounds[colName]) kanbanSounds[colName]();
    showToast('Moved to ' + colName.charAt(0).toUpperCase() + colName.slice(1) + '!', '📌');
  }
});

// jQuery UI only listens for mouse events; translate touches so the board
// is draggable on phones/tablets too.
//
// The drag must be *claimed*, not assumed. Grabbing every touchstart on a
// card meant a swipe up to reach the Done column dragged the card
// instead — and on a phone the board is a single tall column, so the
// cards cover most of what the reader needs to scroll past. A card is
// only picked up after the finger has held still for LONG_PRESS_MS;
// move before that and the touch is released back to the scroller.
//
// Listeners are native with {passive: false} because Chrome makes
// document-level touch listeners passive by default, which silently
// drops the preventDefault the drag depends on.
(function () {
  if (!('ontouchstart' in window)) return;

  var LONG_PRESS_MS = 350;
  var MOVE_TOLERANCE = 10; // px of drift still counted as "held still"

  function dispatch(el, type, x, y) {
    el.dispatchEvent(new MouseEvent(type, {
      bubbles: true, cancelable: true, view: window,
      clientX: x, clientY: y, screenX: x, screenY: y,
      button: 0
    }));
  }

  document.addEventListener('touchstart', function (e) {
    var card = e.target.closest && e.target.closest('.kanban-card');
    if (!card) return;

    var start = e.changedTouches[0];
    var startX = start.clientX, startY = start.clientY;
    var dragging = false;

    var timer = setTimeout(function () {
      dragging = true;
      card.classList.add('kanban-card--held');
      if (navigator.vibrate) navigator.vibrate(10);
      dispatch(card, 'mousedown', startX, startY);
    }, LONG_PRESS_MS);

    function onMove(me) {
      var t = me.changedTouches[0];
      if (!dragging) {
        // Moved before the press landed — this was a scroll, not a grab.
        if (Math.abs(t.clientX - startX) > MOVE_TOLERANCE ||
            Math.abs(t.clientY - startY) > MOVE_TOLERANCE) end();
        return;
      }
      me.preventDefault();
      dispatch(card, 'mousemove', t.clientX, t.clientY);
    }

    function onEnd(ue) {
      var t = ue.changedTouches[0];
      if (dragging) dispatch(card, 'mouseup', t.clientX, t.clientY);
      end();
    }

    function end() {
      clearTimeout(timer);
      card.classList.remove('kanban-card--held');
      document.removeEventListener('touchmove', onMove, { passive: false });
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    }

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
  }, { passive: true });
})();