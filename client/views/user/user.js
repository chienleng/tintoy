Template.user.helpers({

});

Template.user.events({

});

Template.user.onCreated(function() {
  this.autorun(function(){
    var userId = this.data.userId();
    this.data.currentUser = GetUser(userId);
  }.bind(this));
});
