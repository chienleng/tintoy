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
  }
});

Template.userHeader.onCreated(function() {

});
