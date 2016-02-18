Template.delivery.helpers({
  deliverySelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.settings.delivery;
  }
});
Template.delivery.events({
  "change .delivery": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.delivery': $(event.currentTarget).val()}
    })
  },
});
