Meteor.startup(function () {
  // Store the last recorded sequence
  if (Counters.find().count() === 0) {
    Counters.insert({
      _id: "jobNum",
      seq: 0
    })
  }

  if (SharedAccounts.find().count() === 0) {
    _.each(fakeSharedAccounts(), function(fakeAccount) {
      SharedAccounts.insert(fakeAccount);
    })
  }

  if (LabUsers.find().count() === 0) {
    _.each(fakeLabUsers(), function(fakeLabUser) {
      LabUsers.insert(fakeLabUser);
    })
  }

  if (Labs.find().count() === 0) {
    _.each(fakeLabs(), function(fakeLab) {
      var labId = Labs.insert(fakeLab);
      _.each(fakeAnnouncements(), function(fakeAnnouncement) {
        fakeAnnouncement.labId = labId;
        Announcements.insert(fakeAnnouncement);
      })
    })
  }
});

/*
  Fake data generators below
*/
function fakeAnnouncements() {
  return [
    {
      time: new Date(),
      message: 'All jobs sent after 5pm today will not be available until the following week.',
      status: 'published'
    },
    {
      time: new Date(),
      message: 'We have ran out of green. They will be ordered on Thursday.',
      status: 'published'
    }
  ]
}

function fakeLabs() {
  return [
    {
      name: '3D Print Lab',
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
    },
    {
      name: 'PaperCut Print Room',
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
    }
  ]
}

function fakeLabUsers() {
 return [
   {
     names: {
       given: 'Malcolm',
       surname: 'Reynolds'
     },
     balance: 20.5,
     email: 'malcolm@serenity.org',
     icon: '/img/users/emoticon-monster.png',
     colour: '#313B4A'
   },
   {
     names: {
       given: 'Zoe',
       surname: 'Washburne'
     },
     balance: 13,
     email: 'zoe@serenity.org',
     icon: '/img/users/emoticon-alien.png',
     colour: '#FF5447'
   },
   {
     names: {
       given: 'Simon',
       surname: 'Tam'
     },
     balance: 13,
     email: 'simon@serenity.org',
     icon: '/img/users/emoticon-nerd.png',
     colour: '#00BDBD'
   }
 ]
}

function fakeSharedAccounts() {
  return [
    {
      label: 'Biology Science',
      balance: 1100
    },
    {
      label: 'Business',
      balance: 2200
    },
    {
      label: 'Communications & Arts',
      balance: 3300
    },
    {
      label: 'Computing & Security',
      balance: 4400
    },
    {
      label: 'Engineering & Technology',
      balance: 5500
    },
    {
      label: 'Exercise & Health Science',
      balance: 6600
    },
    {
      label: 'Medical Sciences',
      balance: 7700
    },
    {
      label: 'Nursing & Midwifery',
      balance: 8800
    },
    {
      label: 'Performing Arts',
      balance: 9900
    },
    {
      label: 'Psychology Science',
      balance: 11000
    },
    {
      label: 'Teacher Education',
      balance: 12000
    }
  ]
}
