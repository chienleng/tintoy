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
      icon: '/img/users/emoticon-monster.png',
      colour: '#313B4A'
    });
    LabUsers.insert({
      names: {
        given: 'Zoe',
        surname: 'Washburne'
      },
      balance: 13,
      email: 'zoe@serenity.org',
      icon: '/img/users/emoticon-alien.png',
      colour: '#FF5447'
    });
    LabUsers.insert({
      names: {
        given: 'Simon',
        surname: 'Tam'
      },
      balance: 13,
      email: 'simon@serenity.org',
      icon: '/img/users/emoticon-nerd.png',
      colour: '#00BDBD'
    });
    // LabUsers.insert({
    //   names: {
    //     given: 'Kaylee',
    //     surname: 'Frye'
    //   },
    //   balance: 13,
    //   email: 'kaylee@serenity.org',
    //   icon: '/img/users/emoticon-devil.png'
    // });
  }

  /*
    LABS - workflow
  */
  if (Labs.find().count() === 0) {
    Labs.insert({
      name: 'Operator Tinny',
      icon: '/img/users/emoticon-pirate.png',
      workflow: 1
    });
    Labs.insert({
      name: 'Operator Billy',
      icon: '/img/users/emoticon-ninja.png',
      worflow: 2
    })
  }
});
