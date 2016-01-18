Template.jobs.helpers({
  jobs: function() {
    var userId = Template.instance().data.userId();
    return Jobs.find({user: GetUser(userId)}, {sort: Session.get('jobsSortOrder')});
  }
});
