/*
  - if job is already submitted, change to job details view
*/
Template.jobSubmission.helpers({
  fileUrl: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return (_.isUndefined(job)) ? "" : job.files[0].url;
  },
  is3d: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : {}; // assume single file
    return fileObj.mimetype === "application/sla" ? true : false;
  }
});

Template.jobSubmission.events({
  "click #foo": function(event, template) {

  }
});

Template.jobSubmission.onCreated(function() {

});

Template.jobSubmission.onRendered(function() {

})
