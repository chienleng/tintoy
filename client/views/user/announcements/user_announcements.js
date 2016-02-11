Template.userAnnouncements.helpers({
  latestAnnouncement: function() {
    return Template.instance().data.currentAnnouncement.get();
  },
  announcements: function() {
    return Announcements.find();
  },
  notLastAnnouncement: function() {

  },
  notFirstAnnouncement: function() {

  }
});

Template.userAnnouncements.onCreated(function() {
  var announcements = Announcements.find({}, {sort: {time: 1}}).fetch();
  this.data.announcements = new ReactiveVar(announcements);
  this.data.currentAnnouncement = new ReactiveVar(announcements[announcements.length-1]);

  var self = this;
  this.autorun(function() {
    var announcements = Announcements.find({}, {sort: {time: 1}}).fetch();
    self.data.announcements.set(announcements)
    self.data.currentAnnouncement.set(announcements[announcements.length-1]);
  })
})
