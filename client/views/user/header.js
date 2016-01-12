Template.userHeader.helpers({
  names: function(){
    var user = Template.instance().data.currentUser;
    return _.isUndefined(user) ? "" : user.names;
  },
  balance: function() {
    var user = Template.instance().data.currentUser;
    return _.isUndefined(user) ? "" : "$"+user.balance.toFixed(2);
  }
});

Template.userHeader.onCreated(function() {
  var userId = this.data.userId();
  this.data.currentUser = GetUser(userId);
});
