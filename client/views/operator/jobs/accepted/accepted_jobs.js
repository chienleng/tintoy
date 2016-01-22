Template.acceptedJobs.helpers({
  accepted: function() {
    return Jobs.find({'latestLog.status': 'accepted'}, {sort: Session.get('jobsSortOrder')});
  },
  count: function() {
    return Jobs.find({'latestLog.status': 'accepted'}).count();
  }

});
