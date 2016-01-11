Template.jobs.helpers({
  jobs: function() {
    return Jobs.find({}, {sort: {submitted: -1}});
  }
});
