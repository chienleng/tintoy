Template.doneJob.events({
  "click .link.card": function(event, template) {
    Session.set('selectedJob', this._id);
    // $('.job-details.modal').modal('show');
  }

});

Template.doneJob.onRendered(function() {
  
});
