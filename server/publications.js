Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, username: 1}});
});
