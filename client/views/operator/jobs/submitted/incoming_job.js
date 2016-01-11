Template.incomingJob.events({
  "click .link.card": function(event, template) {
    Session.set('selectedJob', this._id);
    // $('.job-details.modal').modal('show');
  }

});

Template.incomingJob.onRendered(function() {
  var x = 0,
    y = 0;
  var startX = 0,
    startY = 0;
  // interact('.incoming-job')
  //   .draggable({})
  //   .on('dragstart', function(event) {
  //     startX = event.dx;
  //     startY = event.dy;
  //   })
  //   .on('dragend', function(event) {
  //     event.target.style.webkitTransform =
  //       event.target.style.transform =
  //       'translate(' + startX + 'px, ' + startY + 'px)';
  //   })
  //   .on('dragmove', function(event) {
  //     x += event.dx;
  //     y += event.dy;
  //
  //     event.target.style.webkitTransform =
  //       event.target.style.transform =
  //       'translate(' + x + 'px, ' + y + 'px)';
  //   });


  interact('.incoming-job')
    .draggable({
      // enable inertial throwing
      inertia: false,
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      onstart: function(event) {
        var target = event.target;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        $(target).addClass('dragged');
      },
      // call this function on every dragend event
      onend: function(event) {
        var target = event.target;
        target.style.webkitTransform =
          target.style.transform =
            'translate(' + startX + 'px, ' + startY + 'px)';

        target.setAttribute('data-x', startX);
        target.setAttribute('data-y', startY);
        $(target).removeClass('dragged');
      }
    });

  function dragMoveListener(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
});
