Template.userAnnouncements.helpers({
  latestAnnouncement: function() {
    var labId = Template.instance().data.labId();
    var announcements = Announcements.find({labId: labId}, {sort: {time: 1}}).fetch();
    return announcements[announcements.length-1];
  },
  isPrintRoom: function() {
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return !_.isUndefined(lab) && lab.name === 'Print Room' ? true : false;
  },
  labName: function() {
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return _.isUndefined(lab) ? "" : lab.name;
  },
  announcements: function() {
    var labId = Template.instance().data.labId();
    var announcements = Announcements.find({labId: labId}, {sort: {time: 1}, limit: 2}).fetch();
    return announcements;
  }
});
