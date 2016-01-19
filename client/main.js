Session.setDefault('labOp', null);
Session.setDefault('labUser', null);

Session.setDefault('selectedJob', null);

Session.setDefault('jobsSortOrder', {submitted: 1, jobNum: -1});

Session.setDefault('filestackKey', null);
Meteor.call('filestackKey', function(err, key) {
  Session.set('filestackKey', key);
});
