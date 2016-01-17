Template.user.helpers({

});

Template.user.events({

});

Template.user.onCreated(function() {
  var self = this;
  self.autorun(function(){
    console.log('autorun')
    var userId = self.data.userId();
    self.data.currentUser = GetUser(userId);
  });
});
