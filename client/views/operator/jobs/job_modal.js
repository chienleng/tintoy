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
  }
});

Template.jobModal.onRendered(function() {
  var self = this;

  $('#job-status-selection').on('change', function() {
  });

  $('.update-job.button').on('click', function() {
    var job = self.data.selectedJob.get();
    var jobId = job._id;
    var message = $('#job-status-message').val();
    switch ($('#job-status-selection').val()) {
      case 'incoming':
      AddJobLog(jobId, JobStatus.INCOMING, message);
      break;
      case 'accepted':
      AddJobLog(jobId, JobStatus.ACCEPTED, message);
      break;
      case 'rejected':
      AddJobLog(jobId, JobStatus.REJECTED, message);
      break;
      case 'done':
      AddJobLog(jobId, JobStatus.DONE, message);
      break;
      default:
    }
  })
})
