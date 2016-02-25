Template.additionalInstructions.helpers({
  additionalInstructions: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.settings.additionalInstructions;
  }
});
Template.additionalInstructions.events({
  "change .additional-instructions": function(event, template){
    var jobId = template.data.jobId();
    console.log($(event.currentTarget).val())
    Jobs.update(jobId, {
      $set: {'settings.additionalInstructions': $(event.currentTarget).val()}
    })
  },
});
