Template.proofCopy.helpers({
  proofCopySelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.settings.proofCopy;
  }
});

Template.proofCopy.events({
  "change .proof-copy": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.proofCopy': $(event.currentTarget).val()}
    })
  },
});
