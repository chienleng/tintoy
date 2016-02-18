Template.costsAccountSelection.helpers({
  accountTypeSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.account.type;
  }
});
