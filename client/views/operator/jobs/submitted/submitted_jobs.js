Template.submittedJobs.helpers({
  incoming: function() {
    return Jobs.find({'latestLog.status': 'incoming'}, {sort: Session.get('jobsSortOrder')});
  },
  count: function() {
    return Jobs.find({'latestLog.status': 'incoming'}).count();
  }
});
