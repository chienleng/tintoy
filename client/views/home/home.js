Template.home.helpers({
  users: function() {
    return LabUsers.find();
  },
  labs: function() {
    return Labs.find();
  },
  lab3DId: function() {
    var lab3D = Labs.findOne({name: '3D Print Lab'});
    return _.isUndefined(lab3D) ? "" : lab3D._id;
  }
});
