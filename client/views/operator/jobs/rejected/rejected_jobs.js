Template.rejectedJobs.helpers({
  rejected: function() {
    var labId = Template.instance().data.labId();
    return Jobs.find({'labId': labId, 'latestLog.status': 'rejected'}, {sort: Session.get('jobsSortOrder')});
  }
});
