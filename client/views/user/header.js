Template.userHeader.helpers({
  username: function(){
    var userId = Template.instance().data.userId();
    var user = Meteor.users.findOne(userId);
    return _.isUndefined(user) ? "" : user.username;
  }
});
