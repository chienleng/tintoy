Template.rejectedJobs.helpers({
  rejected: function() {
    return Jobs.find({'latestLog.status': 'rejected'}, {sort: Session.get('jobsSortOrder')});
  }
});
