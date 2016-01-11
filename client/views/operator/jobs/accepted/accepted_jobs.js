Template.acceptedJobs.helpers({
  accepted: function() {
    return Jobs.find({status: 'accepted'}, {sort: {submitted: -1}});
  }
});
