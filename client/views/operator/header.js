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
  }
});

Template.operatorHeader.events({

});
