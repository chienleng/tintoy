Template.doneJobs.helpers({
  done: function() {
    return Jobs.find({status: 'done'}, {sort: Session.get('jobsSortOrder')});
  }
});
