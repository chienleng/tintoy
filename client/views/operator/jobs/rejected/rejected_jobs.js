Template.rejectedJobs.helpers({
  rejected: function() {
    return Jobs.find({status: 'rejected'}, {sort: Session.get('jobsSortOrder')});
  }
});
