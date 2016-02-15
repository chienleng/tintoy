Template.operatorHeader.helpers({
  isKanbanActive: function() {
    var isKanban = Template.instance().data.menuItem === 'Print Room Kanban' || false;
    return isKanban ? 'active' : '';
  },
  isAlJobsActive: function() {
    var isAllJobs = Template.instance().data.menuItem === 'All Jobs' || false;
    return isAllJobs ? 'active' : '';
  },
  isPrintRoomsActive: function() {
    var isPrintRooms = Template.instance().data.menuItem === 'Print Rooms' || false;
    return isPrintRooms ? 'active' : '';
  },
  labs: function() {
    return Labs.find();
  },
  active: function() {
    try {
      var labId = Template.instance().data.labId();
      return this._id === labId ? 'active' : '';
    } catch(e) {
      return ''
    }
  }
});

Template.operatorHeader.events({
  'click a.lab': function(event, template) {
    var labId = $(event.currentTarget).data('lab-id');
    Session.set("noRender", true);
    FlowRouter.go('/operator/labs/' + labId);
    Session.set("noRender", false);

    return false;
  }
});
