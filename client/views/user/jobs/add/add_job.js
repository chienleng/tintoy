var newJob = {
  jobNum: null,
  customName: '',
  filename: 'newfile.stl',
  fileExtension: '.stl',
  user: {
    id: null,
    name: ''
  },
  pickupDate: new Date(),
  status: 'incoming',
  submitted: new Date(), // current time
  account: {
    type: 'Personal',
    accountId: '',
    code: ''
  },
  settings: {
    colour: 'dodgerBlue',
    material: '',
    size: {
      width: 16,
      height: 16,
      unit: 'cm'
    }
  }
}

// for auto incrementing jobNum
function getNextSequence(name) {
  try {
    Counters.update(name, {
      $inc: {
        seq: 1
      }
    });
    return Counters.findOne(name).seq;
  } catch (e) {
    console.error("getNextSequence", e.message);
  }
}

Template.addJob.events({
  "click #addJob": function(event, template) {
    $('.modal').modal('show');
  }
});

Template.addJob.onRendered(function() {
  var currentUser = this.data.currentUser;
  var user = {
    id: currentUser._id,
    names: currentUser.names
  }
  $('.code.field, .account-selection.field').hide();

  $('.modal')
    .modal({
      onApprove: function() {
        newJob.customName = $('input.job-custom-name').val();
        newJob.jobNum = getNextSequence('jobNum'); // manually insert job num here.
        newJob.user = user;
        Jobs.insert(newJob);
      }
    })
    .modal('setting', 'transition', 'fade up')
    .modal('setting', 'duration', 250)

  //https://bgrins.github.io/spectrum/#options-showPaletteOnly
  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    color: 'dodgerBlue',
    palette: [
      ['black', 'dodgerBlue', 'darkred', 'green', 'gray', 'linen', 'orangeRed', 'white']
    ]
  });

  var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'MMM D YYYY',
    onSelect: function() {
      newJob.pickupDate = this.getMoment().toISOString();
    }
  });

  $('.ui.dropdown').dropdown({
    onChange: function(value, text, $choice) {
      var $accountCharge = $choice.closest('.account-charge');
      if ($accountCharge.length) {
        $('.code.field, .account-selection.field').hide();
        switch (value) {
          case 'personal':
            console.log('personal');
            break;
          case 'shared':
            $('.account-selection.field').fadeIn();
            break;
          case 'code':
            $('.code.field').fadeIn();
            break;
          default:
            console.warn('nothing selected.')
        }
      }

    }
  });

  filepicker.setKey(Session.get('filestackKey'));
  $('#example2').hide();

  filepicker.makeDropPane($('#exampleDropPane')[0], {
    dragEnter: function() {
      $("#exampleDropPane").find('.drop-zone').addClass('drop-target');
    },
    dragLeave: function() {
      $("#exampleDropPane").find('.drop-zone').removeClass('drop-target');
    },
    onSuccess: function(Blobs) {
      $('#example2').hide();
      $("#exampleDropPane").find('.drop-zone').fadeIn();
      $("#exampleDropPane").find('.drop-zone .description').text("Done, see result below");
      $("#localDropResult").text(JSON.stringify(Blobs));

      // [{"url":"https://cdn.filestackcontent.com/4PLkBOltSbSgIv2pQzRq","filename":"diagram.pdf","mimetype":"application/pdf","size":4805044,"isWriteable":false}]
      // [{"url":"https://cdn.filestackcontent.com/Ki6XMGKcRpR4aCEap7XD","filename":"slotted_disk (1).stl","mimetype":"application/sla","size":82878,"isWriteable":false}]
    },
    onError: function(type, message) {
      // $("#localDropResult").text('(' + type + ') ' + message);
      $("#exampleDropPane").find('.drop-zone').show();
    },
    onProgress: function(percentage) {
      $("#exampleDropPane").find('.drop-zone').removeClass('drop-target').hide();
      $('#example2').fadeIn();
      $('#example2').progress({
        percent: percentage
      });
    }
  });

});
