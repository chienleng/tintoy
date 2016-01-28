Template.acceptedJobs.helpers({
  accepted: function() {
    return Jobs.find({'latestLog.status': 'accepted'}, {sort: Session.get('jobsSortOrder')});
  },
  hasJobs: function() {
    return Jobs.find({'latestLog.status': 'accepted'}).count() > 0;
  },
  count: function() {
    return Jobs.find({'latestLog.status': 'accepted'}).count();
  },
  showAcceptedFilters: function() {
    console.log(Template.instance().data.showAcceptedFilters.get())
    return Template.instance().data.showAcceptedFilters.get();
  }
});
Template.acceptedJobs.events({
  'click .accepted-jobs .current-sort a': function() {
    var showAcceptedFilters = Template.instance().data.showAcceptedFilters.get();
    Template.instance().data.showAcceptedFilters.set(!showAcceptedFilters);
    return false;
  },
  'click .accepted-jobs .filter-form .cancel': function() {
    Template.instance().data.showAcceptedFilters.set(false);
    return false
  },
  'click .accepted-jobs .filter-form .apply': function() {
    Template.instance().data.showAcceptedFilters.set(false);
    return false
  },
  'change .accepted-jobs .sort-selection': function() {
    Template.instance().data.showAcceptedFilters.set(false);
  }
});

Template.acceptedJobs.onCreated(function() {
  this.data.showAcceptedFilters = new ReactiveVar(false);
});
