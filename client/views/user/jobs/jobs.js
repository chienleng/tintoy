Template.jobs.helpers({
  jobs: function() {
    var userId = Template.instance().data.userId();
    return Jobs.find({user: GetUser(userId), status: {$ne: 'pending'}}, {sort: Session.get('jobsSortOrder')});
  },
  pendingJobs: function() {
    var userId = Template.instance().data.userId();
    return Jobs.find({user: GetUser(userId), status: 'pending'}, {sort: Session.get('jobsSortOrder')});
  }
});
Template.jobs.events({
  "click .submitted-jobs .job-row": function() {
    var path = '/users/' + this.user._id + '/jobs/' + this._id;
    FlowRouter.go(path);
  },
  "click .pending-jobs .job-row": function() {
    var path = '/users/' + this.user._id + '/submit/' + this._id;
    FlowRouter.go(path);
  }
})
