Meteor.startup(function () {

  // Store the last recorded sequence
  if (Counters.find().count() === 0) {
    Counters.insert({
      _id: "jobNum",
      seq: 0
    })
  }

  //TODO: create user accounts if none available
});
