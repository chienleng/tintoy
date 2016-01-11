Template.rejectedJobs.helpers({
  rejected: function() {
    return Jobs.find({status: 'rejected'}, {sort: {submitted: -1}});
  }
});
