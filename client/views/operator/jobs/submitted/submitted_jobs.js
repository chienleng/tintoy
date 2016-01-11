Template.submittedJobs.helpers({
  incoming: function() {
    return Jobs.find({status: 'incoming'}, {sort: {submitted: -1}});
  }
});
