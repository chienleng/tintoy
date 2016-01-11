Session.setDefault('selectedJob', null);
Session.setDefault('jobsSortOrder', {submitted: -1, jobNum: -1});

//Meteor.subscribe("directory");

// Randomly tada the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('tada');
}, Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000);
