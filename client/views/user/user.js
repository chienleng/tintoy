Template.user.helpers({

});

Template.user.events({

});

Template.user.onCreated(function() {
  var userId = this.data.userId();
  this.data.currentUser = GetUser(userId);
});
