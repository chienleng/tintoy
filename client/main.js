Session.setDefault('selectedJob', null);

// Randomly tada the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('tada');
}, Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000);
