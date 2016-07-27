import interact from 'interact.js';
export default function drag(Parent) {
  function dragMoveListener(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.msTransform = target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  };
  interact('.drop-target').dropzone({
    accept: '.draggable',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
    ondrop: function(event) {
      let d = parseInt(event.relatedTarget.getAttribute('rel'));
      let t = parseInt(event.target.getAttribute('rel'));
      Parent.currentAnswer[d] = t;
    },
    ondragleave: function(event) {
      let d = parseInt(event.relatedTarget.getAttribute('rel'));
      Parent.currentAnswer[d] = -1;
    },
  });
  interact('.draggable')
    .draggable({
      inertia: true,
      restrict: {
        restriction: document.getElementById('dragWrapper'),
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }
      },
      autoScroll: true,
      onmove: dragMoveListener,
      onend: function(event) {
        Parent.calculatePoints();
      }
    });
}