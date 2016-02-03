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
  }
});

Template.lab.events({

});

Template.lab.onRendered(function() {
  console.log(this.data.labId())
  interact('.rejected-jobs .drop-zone').dropzone({
    accept: '.incoming-job, .accepted-job, .done-job',
    overlap: 0.5,
    ondropactivate: function(event) {
      $(event.target).closest('.segment').addClass('drop-active');
      event.target.classList.add('drop-active');
      console.log('ondropactivate');

    },
    ondropdeactivate: function(event) {
      // remove active dropzone feedback
      $(event.target).closest('.segment').removeClass('drop-active');
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
      console.log('ondropdeactivate')
    },
    ondragenter: function(event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      console.log('ondragenter')
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
    },
    ondragleave: function(event) {
      console.log('ondragleave')
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      Session.set('selectedJob', jobId);

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
    ondropactivate: function(event) {
      $(event.target).closest('.segment').addClass('drop-active');
      event.target.classList.add('drop-active');
      console.log('ondropactivate');

    },
    ondropdeactivate: function(event) {
      // remove active dropzone feedback
      $(event.target).closest('.segment').removeClass('drop-active');
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
      console.log('ondropdeactivate')
    },
    ondragenter: function(event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      console.log('ondragenter')
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
    },
    ondragleave: function(event) {
      console.log('ondragleave')
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
    },
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
    ondropactivate: function(event) {
      $(event.target).closest('.segment').addClass('drop-active');
      event.target.classList.add('drop-active');
      console.log('ondropactivate');

    },
    ondropdeactivate: function(event) {
      // remove active dropzone feedback
      $(event.target).closest('.segment').removeClass('drop-active');
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
      console.log('ondropdeactivate')
    },
    ondragenter: function(event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      console.log('ondragenter')
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
    },
    ondragleave: function(event) {
      console.log('ondragleave')
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
    },
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
    ondropactivate: function(event) {
      $(event.target).closest('.segment').addClass('drop-active');
      event.target.classList.add('drop-active');
      console.log('ondropactivate');

    },
    ondropdeactivate: function(event) {
      // remove active dropzone feedback
      $(event.target).closest('.segment').removeClass('drop-active');
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
      console.log('ondropdeactivate')
    },
    ondragenter: function(event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      console.log('ondragenter')
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
    },
    ondragleave: function(event) {
      console.log('ondragleave')
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function(event) {
      var draggableElement = event.relatedTarget;
      var jobId = $(draggableElement).data('id');

      Session.set('selectedJob', jobId);

      AddJobLog(jobId, JobStatus.DONE, null);
    }
  })

  // Meteor.call('dndSetup');
  $('.ui.dropdown').dropdown();

  //https://bgrins.github.io/spectrum/#options-showPaletteOnly
  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    color: 'dodgerBlue',
    palette: [
      ['black', 'dodgerBlue', 'darkred', 'green', 'gray', 'linen', 'orangeRed', 'white']
    ]
  });

  // $('.modal')
  //   .modal({
  //     allowMultiple: false
  //   })
  //   .modal('setting', 'transition', 'fade up')
  //   .modal('setting', 'duration', 250);
  //
  // $('.reject-message.modal')
  //   .modal('attach events', '.job-details.modal .reject.button');

  // $('.job-details.modal').modal('show');
});
