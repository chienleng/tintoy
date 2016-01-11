var newJob = {
  jobNum: null,
  customName: '',
  filename: 'newfile.stl',
  fileExtension: '.stl',
  userId: 'Steven Tan',
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
    Counters.update(name, {$inc: {seq: 1}});
    return Counters.findOne(name).seq;
  } catch(e) {
    console.error("getNextSequence", e.message);
  }
}

Template.addJob.events({
  "click #addJob": function(event, template) {
    $('.modal').modal('show');
  }
});

Template.addJob.onRendered(function() {
  $('.code.field, .account-selection.field').hide();

  $('.modal')
    .modal({
      onApprove: function() {
        newJob.customName = $('input.job-custom-name').val();
        newJob.jobNum = getNextSequence('jobNum'); // manually insert job num here.
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
});
