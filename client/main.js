Session.setDefault("noRender", false);
Session.setDefault('labOp', null);
Session.setDefault('labUser', null);

Session.setDefault('selectedJob', null);
Session.setDefault('3dColour', '#1e90ff');

Session.setDefault('jobsSortOrder', {submitted: 1, jobNum: -1});

Session.setDefault('filestackKey', null);
Meteor.call('filestackKey', function(err, key) {
  Session.set('filestackKey', key);
});
