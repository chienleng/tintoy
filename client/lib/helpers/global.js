this.GetUser = function(userId) {
  return LabUsers.findOne(userId);
};

this.GetJob = function(jobId) {
  return Jobs.findOne(jobId);
};

// for auto incrementing jobNum
this.GetNextSequence = function(name) {
  try {
    Counters.update(name, {$inc: {seq: 1}});
    return Counters.findOne(name).seq;
  } catch (e) {
    console.error("getNextSequence", e.message);
  }
};

// Randomly tada the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('tada');
}, Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000);
