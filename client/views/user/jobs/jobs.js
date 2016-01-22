Template.jobs.helpers({
  jobs: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return Jobs.find({'user._id': user._id, 'latestLog.status': {$ne: 'pending'}}, {sort: Session.get('jobsSortOrder')});
  },
  pendingJobs: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return Jobs.find({'user._id': user._id, 'latestLog.status': 'pending'}, {sort: Session.get('jobsSortOrder')});
  },
  hasJobs: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return Jobs.find({'user._id': user._id, 'latestLog.status': {$ne: 'pending'}}, {sort: Session.get('jobsSortOrder')}).count() > 0;
  }
});
Template.jobs.events({
  "click .jobs .item": function() {
    var path = '/users/' + this.user._id + '/jobs/' + this._id;
    FlowRouter.go(path);
  },
  "click .pending-jobs .job-row": function() {
    var path = '/users/' + this.user._id + '/submit/' + this._id;
    FlowRouter.go(path);
  }
})
