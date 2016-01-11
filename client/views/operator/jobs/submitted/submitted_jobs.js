Template.submittedJobs.helpers({
  incoming: function() {
    return Jobs.find({status: 'incoming'}, {sort: Session.get('jobsSortOrder')});
  }
});
