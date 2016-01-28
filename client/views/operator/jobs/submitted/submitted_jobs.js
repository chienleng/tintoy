Template.submittedJobs.helpers({
  incoming: function() {
    return Jobs.find({'latestLog.status': 'incoming'}, {sort: Session.get('jobsSortOrder')});
  },
  hasJobs: function() {
    return Jobs.find({'latestLog.status': 'incoming'}).count() > 0;
  },
  count: function() {
    return Jobs.find({'latestLog.status': 'incoming'}).count();
  },
  showSubmittedFilters: function() {
    console.log(Template.instance().data.showSubmittedFilters.get())
    return Template.instance().data.showSubmittedFilters.get();
  }
});

Template.submittedJobs.events({
  'click .incoming-jobs .current-sort a': function() {
    var showSubmittedFilters = Template.instance().data.showSubmittedFilters.get();
    Template.instance().data.showSubmittedFilters.set(!showSubmittedFilters);
    return false;
  },
  'click .incoming-jobs .filter-form .cancel': function() {
    Template.instance().data.showSubmittedFilters.set(false);
    return false
  },
  'click .incoming-jobs .filter-form .apply': function() {
    Template.instance().data.showSubmittedFilters.set(false);
    return false
  },
  'change .incoming-jobs .sort-selection': function() {
    Template.instance().data.showSubmittedFilters.set(false);
  }
});

Template.submittedJobs.onCreated(function() {
  this.data.showSubmittedFilters = new ReactiveVar(false);
});
