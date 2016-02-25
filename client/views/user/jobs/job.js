/*
  TODO:
  - check this job belongs to this user
*/
Template.userJob.helpers({
  labName: function() {
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return _.isUndefined(lab) ? '' : lab.name;
  },
  names: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? '' : user.names;
  },
  userid: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? '' : user.names.userid;
  },
  selectedJob: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return job;
  },
  copiesPagesSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var copiesPages = null;
    var string = ""
    if (!_.isUndefined(job)) {
      copiesPages = job.settings.copiesPages;
      string += copiesPages.copies + (copiesPages.copies > 1 ? " copies" : " copy") + ", ";
      string += (copiesPages.twoSided ? "Two-Sided" : "Single-Sided") + ", ";
      string += copiesPages.size + ", ";
      string += copiesPages.paperColour + ", ";
      string += copiesPages.type
    }
    return string;
  },
  filename: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.files[0].filename;
  },
  docPreviewUrl: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.files[0].viewerUrl;
  },
  pdf: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/pdf" ? true : false;
  },
  image: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && _.contains(ImageTypes, fileObj.mimetype) ? true : false;
  },
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

Template.userJob.events({
  "click .done.button": function() {
    var job = Template.instance().data.job;
    var labId = Template.instance().data.labId();
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId+'/labs/'+labId);
    return false;
  }
})

Template.userJob.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});
