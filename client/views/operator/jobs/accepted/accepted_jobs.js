Template.acceptedJobs.helpers({
  isAscend: function() {
    var cssClass = Template.instance().data.sortDirection.get() === 1 ? 'green active' : '';
    return cssClass;
  },
  isDescend: function() {
    var cssClass = Template.instance().data.sortDirection.get() === -1 ? 'green active' : '';
    return cssClass;
  },
  sortTypeClass: function() {
    var cssClass = Template.instance().data.sortType.get() === 'user.names.given' ? 'alphabet' : 'numeric';
    return cssClass;
  },
  hasJobs: function() {
    var filter = Template.instance().data.labAcceptedFilter;
    return Jobs.find(filter).count() > 0;
  },
  count: function() {
    var filter = Template.instance().data.labAcceptedFilter;
    return Jobs.find(filter).count();
  },
  showAcceptedFilters: function() {
    return Template.instance().data.showAcceptedFilters.get();
  },
  doubleAngleDirection: function() {
    var show = Template.instance().data.showAcceptedFilters.get();
    return show ? 'up' : 'down';
  },
  searchString: function() {
    return Template.instance().data.jobSearch.get();
  },
  filteredJobs: function() {
    console.log(Template.instance().data)
    var labId = Template.instance().data.labId();
    var filter = Template.instance().data.labAcceptedFilter;
    var searchString = Template.instance().data.jobSearch.get();
    var sortType = Template.instance().data.sortType.get();
    var sortDirection = Template.instance().data.sortDirection.get();
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
  'change .accepted-jobs .sort-selection': function(event, template) {
    var selected = $(event.currentTarget).val();
    template.data.sortType.set(selected);
  },
  'keyup .accepted-jobs-filter': function(event, template) {
    template.data.jobSearch.set($(event.currentTarget).val());
  },
  'click .accepted-jobs .sort-direction': function(event, template) {
    var direction = $(event.currentTarget).data('value');
    template.data.sortDirection.set(parseInt(direction));
    return false
  },
  'click .accepted-jobs .toggle-filter': function(event, template) {
    var toggle = Template.instance().data.showAcceptedFilters.get();
    Template.instance().data.showAcceptedFilters.set(!toggle);
    return false
  }
});

Template.acceptedJobs.onCreated(function() {
  this.autorun(function() {
    var labId = this.data.labId();
    this.data.jobSearch = new ReactiveVar("");
    this.data.sortType = new ReactiveVar('jobNum');
    this.data.sortDirection = new ReactiveVar(1);
    this.data.showAcceptedFilters = new ReactiveVar(false);
    this.data.labAcceptedFilter = {
      'labId': labId,
      'latestLog.status': 'accepted'
    }
  }.bind(this))

});
