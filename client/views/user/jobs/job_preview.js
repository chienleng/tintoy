/*
  - if job is already submitted, change to job details view
*/
Template.jobPreview.helpers({
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
  accountTypeSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var string = "";

    if (_.isUndefined(job)) {
      string += ""
    } else {
      string += job.account.type;
      if (job.account.type === "Shared") {
        string += " — " + job.account.accountId;
      }
    }
    return string;
  },
  deliverySelection: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var delivery = null;
    var string = ""
    if (!_.isUndefined(job)) {
      delivery = job.settings.delivery;
      string += delivery;
      if (delivery !== 'Pick-up') {
        string += ' — ' + job.settings.deliveryAddress;
      }
    }
    return string;
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
  finishingSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var finishing = null;
    var string = ""
    if (!_.isUndefined(job)) {
      finishing = job.settings.finishing.collate;
      if (finishing.type === 'Bind') {
        string +=  finishing.bind + " binding, ";
      } else if (finishing.type === 'Fold' && !_.isUndefined(finishing.fold)) {
        string += finishing.fold + " fold";
      } else {
        string += finishing.type;
        if (finishing.type === 'Staple') {
          string += ", ";
        }
      }

      if (finishing.type !== "Don't collate" && finishing.type !== "Fold") {
        string += "Front: " + finishing.frontCover + ", ";
        string += "Back: " + finishing.backCover;
      }
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
  threeD: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
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
