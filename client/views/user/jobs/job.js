/*
  TODO:
  - check this job belongs to this user
*/
Template.userJob.helpers({
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
  }
});

Template.userJob.events({
  "click .done.button": function() {
    var job = Template.instance().data.job;
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId);
    return false;
  }
})

Template.userJob.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});
