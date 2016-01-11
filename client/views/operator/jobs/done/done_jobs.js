Template.doneJobs.helpers({
  done: function() {
    return Jobs.find({status: 'done'}, {sort: {submitted: -1}});
  }
});
