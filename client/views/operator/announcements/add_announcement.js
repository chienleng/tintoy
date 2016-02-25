Template.addAnnouncement.helpers({
  isAdded: function(){
    return Template.instance().data.added.get();
  },
  latestAnnouncement: function() {
    var labId = Template.instance().data.labId();
    var all = Announcements.find({labId: labId}, {sort: {time: -1}}).fetch();
    return all[0];
  }
});

Template.addAnnouncement.events({
  "click .add-announcement-btn": function(event, template) {
    Announcements.insert({
      time: new Date(),
      message: $('.announcement-message').val(),
      status: 'published',
      labId: template.data.labId()
    });

    template.data.added.set(true);
  },
  "click .close-announcement-btn": function(event, template) {
    $('.show-add-announcement').popup('hide');
  }
});

Template.addAnnouncement.onCreated(function() {
  this.data.added = new ReactiveVar(false);
});

Template.addAnnouncement.onRendered(function() {
  var self = this;

  $('.show-add-announcement').popup({
    popup: $('.add-announcement-form'),
    on: 'click',
    position: 'bottom right',
    onHide: function() {
      self.data.added.set(false);
    }
  });
});
