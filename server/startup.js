Meteor.startup(function () {
  // Store the last recorded sequence
  if (Counters.find().count() === 0) {
    Counters.insert({
      _id: "jobNum",
      seq: 0
    })
  }

  if (SharedAccounts.find().count() === 0) {
    SharedAccounts.insert({
      label: 'Biology Science',
      balance: 1100
    });
    SharedAccounts.insert({
      label: 'Business',
      balance: 2200
    });
    SharedAccounts.insert({
      label: 'Communications & Arts',
      balance: 3300
    });
    SharedAccounts.insert({
      label: 'Computing & Security',
      balance: 4400
    });
    SharedAccounts.insert({
      label: 'Engineering & Technology',
      balance: 5500
    });
    SharedAccounts.insert({
      label: 'Exercise & Health Science',
      balance: 6600
    });
    SharedAccounts.insert({
      label: 'Medical Sciences',
      balance: 7700
    });
    SharedAccounts.insert({
      label: 'Nursing & Midwifery',
      balance: 8800
    });
    SharedAccounts.insert({
      label: 'Performing Arts',
      balance: 9900
    });
    SharedAccounts.insert({
      label: 'Psychology Science',
      balance: 11000
    });
    SharedAccounts.insert({
      label: 'Teacher Education',
      balance: 12000
    });
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
