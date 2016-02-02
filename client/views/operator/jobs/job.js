/*
  TODO:
  - check this job belongs to this user
*/
Template.operatorJob.helpers({
  fileUrl: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.files[0].url;
  },
  jobNum: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.jobNum;
  },
  threeD: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : {}; // assume single file
    return fileObj.mimetype === "application/sla" ? true : false;
  },
  jobLogs: function() {
    var jobId = Template.instance().data.jobId();
    return GetLogsByJobId(jobId);
  },
  latestStatus: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.latestLog.status;
  },
  isRejected: function() {
    return this.status === JobStatus.REJECTED ? 'error' : '';
  },
  isDone: function() {
    return this.status === JobStatus.DONE ? 'positive' : '';
  }
});

Template.operatorJob.events({
  "click .done.button": function() {
    FlowRouter.go('/operator/jobs');
    return false;
  }
})

Template.operatorJob.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});
