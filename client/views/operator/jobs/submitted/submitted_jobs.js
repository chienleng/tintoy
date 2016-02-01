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
    return Template.instance().data.showSubmittedFilters.get();
  },
  searchString: function() {
    return Session.get('submittedJobsSearch');
  },
  filteredJobs: function() {
    var searchString = Session.get('submittedJobsSearch');

    if (!searchString) {
      return Jobs.find({'latestLog.status': 'incoming'});
    }

    var list = Jobs.find({'latestLog.status': 'incoming'}).fetch();
    return _.filter(list, function(job) {
      var findCustomName = job.customName.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      var findGivenName = job.user.names.given.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      var findSurname = job.user.names.surname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      return findCustomName || findGivenName || findSurname;
    })
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
  },
  'keyup .submitted-jobs-filter': function(event) {
    Session.set('submittedJobsSearch', $(event.currentTarget).val());
  }
});

Template.submittedJobs.onCreated(function() {
  this.data.showSubmittedFilters = new ReactiveVar(false);
});
