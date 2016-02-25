Template.submittedJobs.helpers({
  isAscend: function() {
    var cssClass = Template.instance().data.submittedSortDirection.get() === 1 ? 'green active' : '';
    return cssClass;
  },
  isDescend: function() {
    var cssClass = Template.instance().data.submittedSortDirection.get() === -1 ? 'green active' : '';
    return cssClass;
  },
  sortTypeClass: function() {
    var cssClass = Template.instance().data.submittedSortType.get() === 'user.names.given' ? 'alphabet' : 'numeric';
    return cssClass;
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
  doubleAngleDirection: function() {
    var show = Template.instance().data.showSubmittedFilters.get();
    return show ? 'up' : 'down';
  },
  searchString: function() {
    return Template.instance().data.submittedJobSearch.get();
  },
  filteredJobs: function() {
    console.log(Template.instance().data)
    var labId = Template.instance().data.labId();
    var filter = Template.instance().data.labSubmittedFilter;
    var searchString = Template.instance().data.submittedJobSearch.get();
    var sortType = Template.instance().data.submittedSortType.get();
    var sortDirection = Template.instance().data.submittedSortDirection.get();
    var sort = {
      [sortType]: sortDirection
    }

    if (!searchString) {
      return Jobs.find(filter, {sort: sort});
    }

    var list = Jobs.find(filter, {sort: sort}).fetch();
    return _.filter(list, function(job) {
      var findName = false;
      if (_.isEmpty(job.customName)) {
        findName = job.files[0].filename.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      } else {
        findName = job.customName.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      }
      var findGivenName = job.user.names.given.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      var findSurname = job.user.names.surname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ? true : false;
      var findBind = (function() {
        var collate = job.settings.finishing.collate.type;
        var find = false;
        if (collate === "Bind") {
          job.settings.finishing.collate.bind.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ?
            find = true : find = false;
        } else {
          job.settings.finishing.collate.type.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ?
            find = true : find = false;
        }
        return find;
      })();
      return findName || findGivenName || findSurname || findBind;
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
  'change .incoming-jobs .sort-selection': function(event, template) {
    var selected = $(event.currentTarget).val();
    template.data.submittedSortType.set(selected);
  },
  'keyup .submitted-jobs-filter': function(event, template) {
    template.data.submittedJobSearch.set($(event.currentTarget).val());
  },
  'click .incoming-jobs .sort-direction': function(event, template) {
    var direction = $(event.currentTarget).data('value');
    template.data.submittedSortDirection.set(parseInt(direction));
    return false
  },
  'click .incoming-jobs .toggle-filter': function(event, template) {
    var toggle = Template.instance().data.showSubmittedFilters.get();
    Template.instance().data.showSubmittedFilters.set(!toggle);
    return false
  }
});

Template.submittedJobs.onCreated(function() {
  this.autorun(function() {
    var labId = this.data.labId();

    this.data.submittedJobSearch = new ReactiveVar("");
    this.data.submittedSortType = new ReactiveVar('jobNum');
    this.data.submittedSortDirection = new ReactiveVar(1);
    this.data.showSubmittedFilters = new ReactiveVar(false);
    this.data.labSubmittedFilter = {
      'labId': labId,
      'latestLog.status': 'incoming'
    }
  }.bind(this))
});
