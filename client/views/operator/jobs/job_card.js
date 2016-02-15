Template.jobCard.helpers({
  stale: function() {
    var now = moment();
    var submitted = moment(Template.instance().data.submitted);
    var diff = now.diff(submitted, 'hours');
    var cssClass = 'grey';
    if (diff > 1 && diff <= 12) {
      cssClass = 'yellow';
    } else if (diff > 12) {
      cssClass = 'orange';
    }

    return cssClass;
  },
  downloadLink: function() {
    return Template.instance().data.files[0].downloadLink;
  },
  threeD: function() {
    var job = Template.instance().data;
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
  }
});

Template.jobCard.events({
  "click .job-link-label": function(event, template){
    var path = '/operator/jobs/' + this._id;
    FlowRouter.go(path);
  }
});
