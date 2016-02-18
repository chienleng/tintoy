/*
  - if job is already submitted, change to job details view
*/
Template.jobPreview.helpers({
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
      string += copiesPages.twoSided ? "Two-Sided" : "Single-Sided" + ", ";
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
    return (_.isUndefined(job)) ? "" : job.files[0].docPreviewUrl;
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
});

Template.jobPreview.events({
  "click .submit-job": function(event, template) {
    var job = GetJob(template.data.jobId());
    var userId = job.user._id;

    AddJobLog(job._id, JobStatus.INCOMING, null);
    FlowRouter.go('/users/'+userId+'/labs/'+job.labId);

    return false;
  },
  "click .cancel.button": function(event, template) {
    var job = GetJob(template.data.jobId());
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId+'/labs/'+job.labId);
    return false;
  },
  "click .back.button": function(event, template) {
    var job = GetJob(template.data.jobId());
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId+'/labs/'+job.labId+'/submit/'+job._id);
    return false;
  }
});
