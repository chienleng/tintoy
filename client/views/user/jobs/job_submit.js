/*
  - if job is already submitted, change to job details view
*/
Template.jobSubmission.helpers({
  fileUrl: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.files[0].url;
  },
  threeD: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
  },
  overFilesizeLimit: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    var filesizeMB = fileObj ? fileObj.size/1024/1024 : 0;
    return filesizeMB >= 1 ? true : false;
  }
});

Template.jobSubmission.events({
  "submit .new-3d-submission": function() {
    var job = Template.instance().data.job;
    var fileObj = job.files[0];
    var fileId = fileObj.url.substring(fileObj.url.lastIndexOf("/")+1, fileObj.url.length);
    var userId = job.user._id;

    job.customName = $('input.job-custom-name').val();
    job.jobNum = GetNextSequence('jobNum'); // manually insert job num here.
    job.type = JobType.THREE_D;
    job.submitted = new Date();
    job.files[0].downloadLink = 'https://www.filestackapi.com/api/file/' + fileId;
    if (job.account.type === Account.SHARED) {
      job.account.accountId = Template.instance().data.sharedAccountId;
    } else if (_.isEmpty(job.account)) {
      job.account = {
        type: Account.PERSONAL
      }
    }
    Jobs.update(job._id, job);
    AddJobLog(job._id, JobStatus.INCOMING, null);
    FlowRouter.go('/users/'+userId);
    return false;
  },
  "click .cancel.button": function() {
    var job = Template.instance().data.job;
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId);
    return false;
  }});

Template.jobSubmission.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.jobSubmission.onRendered(function() {

})
