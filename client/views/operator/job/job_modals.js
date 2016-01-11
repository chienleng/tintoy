Template.jobModals.helpers({
  selectedJob: function() {
    var jobId = Session.get('selectedJob');
    return Jobs.findOne(jobId);
  }
});

Template.jobModals.events({
});

Template.jobModals.onRendered(function() {
  
})
