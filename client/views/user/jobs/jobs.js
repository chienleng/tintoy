Template.jobs.helpers({
  jobs: function() {
    return Jobs.find({}, {sort: Session.get('jobsSortOrder')});
  }
});
