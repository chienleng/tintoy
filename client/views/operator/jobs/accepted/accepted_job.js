Template.acceptedJob.events({
  "click .link.card": function(event, template) {
    Session.set('selectedJob', this._id);
    // $('.job-details.modal').modal('show');
  },
  "click .accept.button": function(event, template) {
    Jobs.update(this._id, {
      $set: {
        status: 'accepted'
      }
    });
  },
  "click .reject.button": function(event, template) {
    Jobs.update(this._id, {
      $set: {
        status: 'rejected'
      }
    });
  }
});

Template.acceptedJob.onRendered(function() {
  
});
