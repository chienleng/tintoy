Template.doneJobs.helpers({
  done: function() {
    var labId = Template.instance().data.labId();
    return Jobs.find({'labId': labId, 'latestLog.status': 'done'}, {sort: Session.get('jobsSortOrder')});
  }
});
