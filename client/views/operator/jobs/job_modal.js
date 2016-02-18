Template.jobModal.helpers({
  selectedJob: function() {
    var job = Template.instance().data.selectedJob.get();
    return _.isUndefined(job) ? {} : job;
  },
  selectedJobId: function() {
    return Template.instance().data.selectedJobId.get();
  },
  fileUrl: function() {
    var job = Template.instance().data.selectedJob.get();
    return (_.isUndefined(job)) ? "" : job.files[0].url;
  },
  docPreviewUrl: function() {
    var job = Template.instance().data.selectedJob.get();
    return (_.isUndefined(job)) ? "" : job.files[0].docPreviewUrl;
  },
  threeD: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
  },
  pdf: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/pdf" ? true : false;
  },
  image: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && _.contains(ImageTypes, fileObj.mimetype) ? true : false;
  },
  filename: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj ? fileObj.filename : "";
  },
  filesize: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj ? (fileObj.size / 1000).toFixed(0) + "KB" : "n/a";
  },
  showCost: function() {
    var type = Session.get('type');
    return type === 'done';
  },
  showRejectReason: function() {
    var type = Session.get('type');
    return type === JobStatus.REJECTED;
  },
  showMessage: function() {
    var type = Session.get('type');
    return type === JobStatus.REJECTED || type === JobStatus.DONE || type === JobStatus.ACCEPTED;
  },
  isRejectedSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.REJECTED ? 'selected' : '';
  },
  isDoneSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.DONE ? 'selected' : '';
  },
  isAcceptedSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.ACCEPTED ? 'selected' : '';
  },
  isIncomingSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.INCOMING ? 'selected' : '';
  }
});

Template.jobModal.onRendered(function() {
  var self = this;

  $('#job-status-selection').on('change', function() {
    console.log($(this).val());
    Session.set('type', $(this).val());
  });

  $('.update-job.button').on('click', function() {
    var jobId = self.data.selectedJobId.get();
    var type = Session.get('type');
    var message = $('#job-status-message').val();
    console.log(jobId);
    console.log(type);
    console.log(message)
    AddJobLog(jobId, type, message);
  })
})
