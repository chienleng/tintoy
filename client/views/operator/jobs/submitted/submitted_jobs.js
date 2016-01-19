Template.submittedJobs.helpers({
  incoming: function() {
    return Jobs.find({status: 'incoming'}, {sort: Session.get('jobsSortOrder')});
  },
  count: function() {
    return Jobs.find({status: 'incoming'}).count();
  }
});
