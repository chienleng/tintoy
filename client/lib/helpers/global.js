this.JobStatus = {
  PENDING: 'pending', // file in cloud, but job not submitted for printing
  INCOMING: 'incoming', // job submitted
  ACCEPTED: 'accepted', // job accepted by operator
  REJECTED: 'rejected', // job rejected by operator
  DONE: 'done', // job done by operator
  RECEIVED: 'received' // job received by user
}
this.JobType = {
  THREE_D: '3D'
}
this.Account = {
  PERSONAL: 'Personal',
  SHARED: 'Shared',
  PIN: 'PIN'
}

this.companyType = {
  EDUCATION: 'Education', // no account selection charges
  CORPORATE: 'Corporate'
}

this.GetUser = function(userId) {
  return LabUsers.findOne(userId);
};

this.GetJob = function(jobId) {
  return Jobs.findOne(jobId);
};

this.GetAccount = function(accountId) {
  return SharedAccounts.findOne(accountId);
};

this.GetFileByJobId = function(jobId) {
  var job = GetJob(jobId);
  var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
  return fileObj;
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

// Randomly pulse the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('pulse');
}, Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000);
