Template.submittedJobs.helpers({
  incoming: function() {
    var filter = Template.instance().data.labSubmittedFilter;
    return Jobs.find(filter, {sort: Session.get('jobsSortOrder')});
  },
  hasJobs: function() {
    var filter = Template.instance().data.labSubmittedFilter;
    return Jobs.find(filter).count() > 0;
  },
  count: function() {
    var filter = Template.instance().data.labSubmittedFilter;
    return Jobs.find(filter).count();
  },
  showSubmittedFilters: function() {
    return Template.instance().data.showSubmittedFilters.get();
  },
  searchString: function() {
    return Session.get('submittedJobsSearch');
  },
  filteredJobs: function() {
    var filter = Template.instance().data.labSubmittedFilter;
    var searchString = Session.get('submittedJobsSearch');

    if (!searchString) {
      return Jobs.find(filter);
    }

    var list = Jobs.find(filter).fetch();
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
  var labId = this.data.labId();
  this.data.showSubmittedFilters = new ReactiveVar(false);
  this.data.labSubmittedFilter = {
    'labId': labId,
    'latestLog.status': 'incoming'
  }

  var labId = Template.instance().data.labId();
  var lab = Labs.findOne(labId);
});
