Template.userMenu.helpers({
  isActive: function() {
    var lab = GetLab(Template.instance().data.labId());
    return lab.name === this.name ? 'active' : ''
  },
  labs: function() {
    return Labs.find();
  },
  labLink: function() {
    var userId = Template.instance().data.userId();
    return '/users/' + userId + '/labs/' + this._id;
  }
});
