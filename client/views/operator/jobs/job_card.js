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
  }
});

Template.jobCard.events({
  "click .job-link-label": function(event, template){
    var path = '/operator/jobs/' + this._id;
    FlowRouter.go(path);
  }
});
