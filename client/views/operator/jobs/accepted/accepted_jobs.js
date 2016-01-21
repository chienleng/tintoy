Template.acceptedJobs.helpers({
  accepted: function() {
    return Jobs.find({status: 'accepted'}, {sort: Session.get('jobsSortOrder')});
  },
  count: function() {
    return Jobs.find({status: 'accepted'}).count();
  }

});
