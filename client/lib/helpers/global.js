this.GetUser = function(userId) {
  return LabUsers.findOne(userId);
}

// Randomly tada the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('tada');
}, Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000);
