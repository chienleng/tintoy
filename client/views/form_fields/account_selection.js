Template.accountSelection.helpers({
  sharedAccounts: function() {
    return SharedAccounts.find({}, {sort: {label: 1}});
  },
  balance: function() {
    return '$5.20';
  }
});

Template.accountSelection.events({

});

Template.accountSelection.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.accountSelection.onRendered(function() {
  var self = this;
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
