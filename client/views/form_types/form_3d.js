Template.form3D.helpers({
  sharedAccounts: function() {
    return SharedAccounts.find({}, {sort: {label: 1}});
  }
});

Template.form3D.events({
  "submit .new-3d-submission": function() {
    var job = Template.instance().data.job;
    var fileObj = job.files[0];
    var fileId = fileObj.url.substring(fileObj.url.lastIndexOf("/")+1, fileObj.url.length);
    var userId = job.user._id;

    job.customName = $('input.job-custom-name').val();
    job.jobNum = GetNextSequence('jobNum'); // manually insert job num here.
    job.status = JobStatus.INCOMING;
    job.type = JobType.THREE_D;
    job.submitted = new Date();
    job.files[0].downloadLink = 'https://www.filestackapi.com/api/file/' + fileId;
    if (job.account.type === Account.SHARED) {
      job.account.accountId = Template.instance().data.sharedAccountId;
    } else if (_.isEmpty(job.account)) {
      job.account = {
        type: Account.PERSONAL
      }
    }
    Jobs.update(job._id, job);
    FlowRouter.go('/users/'+userId);
    return false;
  },
  "click .cancel.button": function() {
    var job = Template.instance().data.job;
    var userId = job.user._id;
    FlowRouter.go('/users/'+userId);
    return false;
  }
});

Template.form3D.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.form3D.onRendered(function() {
  var self = this;

  setupColorPicker();
  setupAccountSelection();

  // setupDatePicker();
  var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'MMM D YYYY',
    onSelect: function() {
      self.data.job.pickupDate = this.getMoment().toISOString();
    }
  });

  $('.code.field, .account-selection.field').hide();
  $('.account-charge .ui.dropdown').dropdown({
    onChange: function(value, text, $choice) {
      var $accountCharge = $choice.closest('.account-charge');
      if ($accountCharge.length) {
        $('.code.field, .account-selection.field').hide();
        switch (value) {
          case 'personal':
            self.data.job.account = {
              type: Account.PERSONAL
            }
            break;
          case 'shared':
            $('.account-selection.field').fadeIn();
            self.data.job.account = {
              type: Account.SHARED,
              accountId: null
            }
            break;
          case 'code':
            $('.code.field').fadeIn();
            self.data.job.account = {
              type: Account.PIN,
              accountPIN: null
            }
            break;
          default:
            console.warn('nothing selected.')
        }
      }

    }
  });

  $('.account-selection .ui.dropdown').dropdown({
    onChange: function(value, text, $choice) {
      self.data.sharedAccountId = value;
    }
  });

});

/* TODO: Branch these out */
function setupColorPicker() {
  //https://bgrins.github.io/spectrum/#options-showPaletteOnly
  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    color: 'dodgerBlue',
    palette: [
      ['black', 'dodgerBlue', 'darkred', 'green', 'gray', 'linen', 'orangeRed', 'white']
    ]
  });
};
function setupDatePicker() {

};
function setupAccountSelection() {
}


// var newJob = {
//   jobNum: null,
//   customName: '',
//   files: [],
//   user: null,
//   pickupDate: null,
//   status: 'pending',
//   added: null,
//   submitted: null,
//   account: {},
//   settings: {}
// }
