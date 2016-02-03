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
      name: 'Lab 1',
      icon: '/img/users/emoticon-pirate.png',
      devices: [
        {
          label: 'Formlabs Form 1+',
          type: '3d'
        },
        {
          label: 'MakerBot Replicator Desktop',
          type: '3d'
        },
        {
          label: 'MakerBot Replicator Z18',
          type: '3d'
        }
      ]
    });
    Labs.insert({
      name: 'Lab 2',
      icon: '/img/users/emoticon-ninja.png',
      devices: [
        {
          label: 'Lexmark E462dtn',
          type: 'paper'
        },
        {
          label: 'Xerox Phaser 6500',
          type: 'paper'
        },
        {
          label: 'Kyocera Mita FS-1370DN',
          type: 'paper'
        }
      ]
    })
  }
});
