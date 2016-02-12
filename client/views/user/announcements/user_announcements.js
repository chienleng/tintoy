Template.userAnnouncements.helpers({
  latestAnnouncement: function() {
    var labId = Template.instance().data.labId();
    var announcements = Announcements.find({labId: labId}, {sort: {time: 1}}).fetch();
    return announcements[announcements.length-1];
  }
});
