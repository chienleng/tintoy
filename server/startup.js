Meteor.startup(function () {
  // Store the last recorded sequence
  if (Counters.find().count() === 0) {
    Counters.insert({
      _id: "jobNum",
      seq: 0
    })
  }

  if (LabUsers.find().count() === 0) {
    LabUsers.insert({
      names: {
        given: 'Malcolm',
        surname: 'Reynolds'
      },
      balance: 20.5,
      email: 'malcolm@serenity.org',
      colour: '#f2711c'
    });
    LabUsers.insert({
      names: {
        given: 'Hoban',
        surname: 'Washburne'
      },
      balance: 13,
      email: 'hoban@serenity.org',
      colour: '#2185d0'
    })
  }

  /*
    LABS - workflow
  */
  if (Labs.find().count() === 0) {
    Labs.insert({
      name: 'Lab Tinny',
      icon: 'cubes',
      workflow: 1
    });
    Labs.insert({
      name: 'Lab Billy',
      icon: 'university',
      worflow: 2
    })
  }
});
