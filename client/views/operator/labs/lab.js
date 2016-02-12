Template.lab.helpers({
  noJobs: function() {
    var jobCount = Jobs.find().count();
    console.log(jobCount);
    return jobCount === 0 ? true : false;
  },
  labName: function() {
    var labId = Template.instance().data.labId();
    var lab = Labs.findOne(labId);
    return _.isUndefined(lab) ? "" : lab.name;
  },
  labJobs: function() {
    var jobs = Jobs.find({type: 'paper'});
    return jobs;
  },
  hasSelectedJob: function() {
    var job = Template.instance().data.selectedJob.get();
    return _.isUndefined(job) ? false : true;
  },
  selectedJob: function() {
    return Template.instance().data.selectedJob.get();
  }
});

Template.lab.events({

});

Template.lab.onCreated(function() {
  this.data.selectedJobId = new ReactiveVar(null);
  this.data.selectedJob = new ReactiveVar();
})

Template.lab.onRendered(function() {
  var x = 0, y = 0;
  var startX = 0, startY = 0;
  var jobsContext = document.querySelector('.jobs-kanban');
  var self = this;

  this.autorun(function(){
     var jobId = self.data.selectedJobId.get();
     self.data.selectedJob.set(GetJob(jobId));
  });

  interact('.ui.card', {context: jobsContext}).on('tap', function (event) {
    self.data.selectedJobId.set($(event.currentTarget).data('id'));
    $('.job-detail-modal').modal('show');
  })

  interact('.ui.card', {context: jobsContext})
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

  interact('.rejected-jobs .drop-zone').dropzone({
    accept: '.incoming-job, .accepted-job, .done-job',
    overlap: 0.5,
    ondropactivate: ondropactivate,
    ondropdeactivate: ondropdeactivate,
    ondragenter: ondragenter,
    ondragleave: ondragleave,
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      $('.reject-message.modal')
        .modal({
          onApprove: function() {
            var message = $('.rejection-message textarea').val();
            AddJobLog(jobId, JobStatus.REJECTED, message);
          },
          onDeny: function() {
            console.log('deny');
          }
        })
        .modal('setting', 'transition', 'fade up')
        .modal('setting', 'duration', 250)
        .modal('show');
    }
  })

  interact('.incoming-jobs .drop-zone').dropzone({
    accept: '.accepted-job, .rejected-job, .done-job',
    overlap: 0.5,
    ondropactivate: ondropactivate,
    ondropdeactivate: ondropdeactivate,
    ondragenter: ondragenter,
    ondragleave: ondragleave,
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      Session.set('selectedJob', jobId);

      AddJobLog(jobId, JobStatus.INCOMING, null);
    }
  })

  interact('.accepted-jobs .drop-zone').dropzone({
    accept: '.incoming-job, .rejected-job, .done-job',
    overlap: 0.5,
    ondropactivate: ondropactivate,
    ondropdeactivate: ondropdeactivate,
    ondragenter: ondragenter,
    ondragleave: ondragleave,
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      Session.set('selectedJob', jobId);

      AddJobLog(jobId, JobStatus.ACCEPTED, null);
    }
  })

  interact('.done-jobs .drop-zone').dropzone({
    accept: '.accepted-job, .incoming-job, .rejected-job',
    overlap: 0.5,
    ondropactivate: ondropactivate,
    ondropdeactivate: ondropdeactivate,
    ondragenter: ondragenter,
    ondragleave: ondragleave,
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      Session.set('selectedJob', jobId);

      AddJobLog(jobId, JobStatus.DONE, null);
    }
  })

});

function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px) rotate(-5deg)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function ondropactivate(event) {
  $(event.target).closest('.segment').addClass('drop-active');
  event.target.classList.add('drop-active');
  console.log('ondropactivate');
};

function ondropdeactivate(event) {
  // remove active dropzone feedback
  $(event.target).closest('.segment').removeClass('drop-active');
  event.target.classList.remove('drop-active');
  event.target.classList.remove('drop-target');
  console.log('ondropdeactivate')
}

function ondragenter(event) {
  var draggableElement = event.relatedTarget,
    dropzoneElement = event.target;
  var jobId = $(draggableElement).data('id');

  console.log('ondragenter')
  Session.set('selectedJob', jobId);
  dropzoneElement.classList.add('drop-target');
  draggableElement.classList.add('can-drop');
}

function ondragleave(event) {
  console.log('ondragleave')
  event.target.classList.remove('drop-target');
  event.relatedTarget.classList.remove('can-drop');
}
