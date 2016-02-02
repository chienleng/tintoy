Template.jobCard.events({
  "click .job-link-label": function(event, template){
    var path = '/operator/jobs/' + this._id;
    FlowRouter.go(path);
  }
});
