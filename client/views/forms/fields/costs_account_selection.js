Template.costsAccountSelection.helpers({
  accountTypeSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var string = "";

    if (_.isUndefined(job)) {
      string += ""
    } else {
      string += job.account.type;
      if (job.account.type === "Shared") {
        string += " — " + job.account.accountId;
      }
    }
    return string;
  }
});
