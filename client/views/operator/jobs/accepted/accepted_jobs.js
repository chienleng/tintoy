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
    return Template.instance().data.showAcceptedFilters.get();
  },
  searchString: function() {
    return Session.get('acceptedJobsSearch');
  },
  filteredJobs: function() {
    var searchString = Session.get('acceptedJobsSearch');

    if (!searchString) {
      return Jobs.find({'latestLog.status': 'accepted'});
    }

    var list = Jobs.find({'latestLog.status': 'accepted'}).fetch();
    return _.filter(list, function(job) {
      var findName = false;
      if (_.isEmpty(job.customName)) {
        findName = job.files[0].filename.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      } else {
        findName = job.customName.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      }
      var findGivenName = job.user.names.given.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      var findSurname = job.user.names.surname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      return findName || findGivenName || findSurname;
    })
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
  },
  'keyup .accepted-jobs-filter': function(event) {
    Session.set('acceptedJobsSearch', $(event.currentTarget).val());
  }
});

Template.acceptedJobs.onCreated(function() {
  this.data.showAcceptedFilters = new ReactiveVar(false);
});
