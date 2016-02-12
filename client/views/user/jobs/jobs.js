Template.jobs.helpers({
  jobs: function() {
    var userId = Template.instance().data.userId();
    var labId = Template.instance().data.labId();
    var user = GetUser(userId);
    return  _.isUndefined(user) ? [] : Jobs.find({'user._id': user._id, 'labId': labId, 'latestLog.status': {$ne: 'pending'}}, {sort: Session.get('jobsSortOrder')});
  },
  pendingJobs: function() {
    var userId = Template.instance().data.userId();
    var labId = Template.instance().data.labId();
    var user = GetUser(userId);
    return  _.isUndefined(user) ? [] : Jobs.find({'user._id': user._id, 'labId': labId, 'latestLog.status': 'pending'}, {sort: Session.get('jobsSortOrder')});
  },
  hasJobs: function() {
    var userId = Template.instance().data.userId();
    var labId = Template.instance().data.labId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? [] : Jobs.find({'user._id': user._id, 'labId': labId, 'latestLog.status': {$ne: 'pending'}}, {sort: Session.get('jobsSortOrder')}).count() > 0;
  }
});

Template.jobs.events({
  "click .jobs-table .job-row": function() {
    var path = '/users/' + this.user._id + '/labs/' + this.labId + '/jobs/' + this._id;
    FlowRouter.go(path);
  },
  'click .jobs .item': function() {
    var path = '/users/' + this.user._id + '/labs/' + this.labId + '/jobs/' + this._id;
    FlowRouter.go(path);
  },
  "click .pending-jobs .job-row": function() {
    var path = '/users/' + this.user._id + '/labs/' + this.labId + '/submit/' + this._id;
    FlowRouter.go(path);
  }
})
