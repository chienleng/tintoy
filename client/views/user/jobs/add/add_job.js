var newJob = {
  jobNum: null,
  customName: '',
  files: [],
  user: null,
  pickupDate: null,
  status: 'pending',
  added: null,
  submitted: null,
  account: {},
  settings: {}
}

Template.addJob.events({
  "click #addJob": function(event, template) {
    $('.modal').modal('show');
  }
});

Template.addJob.onRendered(function() {
  var user = null;
  var self = this;

  self.autorun(function() {
    user = GetUser(self.data.userId());
    filepicker.setKey(Session.get('filestackKey'));
  })

  $('.code.field, .account-selection.field').hide();

  $('.modal')
    .modal({
      onApprove: function() {
        newJob.customName = $('input.job-custom-name').val();
        newJob.jobNum = GetNextSequence('jobNum'); // manually insert job num here.
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
      var fileId = Blobs[0].url.substring(Blobs[0].url.lastIndexOf("/")+1, Blobs[0].url.length);
      newJob.user = user;
      newJob.files = Blobs;
      newJob.added = new Date();
      var jobId = Jobs.insert(newJob);
      
      FlowRouter.go('/user/' + user._id +'/submit/' + jobId);

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
