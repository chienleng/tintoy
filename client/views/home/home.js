Template.home.helpers({
  users: function() {
    return LabUsers.find();
  },
  labs: function() {
    return Labs.find();
  }
});
