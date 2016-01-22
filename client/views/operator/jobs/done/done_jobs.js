Template.doneJobs.helpers({
  done: function() {
    return Jobs.find({'latestLog.status': 'done'}, {sort: Session.get('jobsSortOrder')});
  }
});
