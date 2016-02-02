Template.jobList.helpers({
  noJobs: function() {
    var jobCount = Jobs.find().count();
    return jobCount === 0 ? true : false;
  },
  jobs: function() {
    return Jobs.find({}, {sort: Session.get('jobsSortOrder')});
  },
});

Template.jobList.events({
  "click .jobs .item": function() {
    var path = '/operator/jobs/' + this._id;
    FlowRouter.go(path);
  }
});

Template.jobList.onRendered(function() {

});
