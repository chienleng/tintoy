Template.user.helpers({
  labName: function() {
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return _.isUndefined(lab) ? '' : lab.name;
  },
  names: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? '' : user.names;
  },
  userid: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? '' : user.names.userid;
  },
  balance: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? '$0.00' : '$'+parseFloat(user.balance).toFixed(2);
  }
});

Template.user.events({

});

Template.user.onCreated(function() {
  this.autorun(function(){
    var userId = this.data.userId();
    this.data.currentUser = GetUser(userId);
  }.bind(this));
});
