Template.userHeader.helpers({
  names: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? "" : user.names;
  },
  balance: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? "" : "$"+user.balance.toFixed(2);
  },
  userid: function() {
    var userId = Template.instance().data.userId();
    var user = GetUser(userId);
    return _.isUndefined(user) ? "" : user.names.userid;
  },
  labName: function() {
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return _.isUndefined(lab) ? '' : lab.name;
  },

});

Template.userHeader.onCreated(function() {

});
