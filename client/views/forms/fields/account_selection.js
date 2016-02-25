Template.accountSelection.helpers({
  sharedAccounts: function() {
    return SharedAccounts.find({}, {sort: {label: 1}});
  },
  isPersonal: function() {
    return Template.instance().data.selectedAccount.get() === Account.PERSONAL;
  },
  isShared: function() {
    return Template.instance().data.selectedAccount.get() === Account.SHARED &&
      Template.instance().data.selectedShared.get();
  },
  balance: function() {
    return '$50.20';
  },
  accountBalance: function() {
    return Template.instance().data.sharedAccountBal.get();
  }
});

Template.accountSelection.events({

});

Template.accountSelection.onCreated(function() {
  this.data.sharedAccountBal = new ReactiveVar('$5000.00');
  this.data.selectedAccount = new ReactiveVar(Account.PERSONAL);
  this.data.selectedShared = new ReactiveVar('');

  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.accountSelection.onRendered(function() {
  var self = this;
  console.log(this)
  var jobId = this.data.jobId();


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
            self.data.selectedAccount.set(Account.PERSONAL);
            Jobs.update(jobId, {
              $set: {'account.type': Account.PERSONAL}
            })

            break;
          case 'shared':
            $('.account-selection.field').fadeIn();
            self.data.job.account = {
              type: Account.SHARED,
              accountId: null
            }
            self.data.selectedAccount.set(Account.SHARED);
            Jobs.update(jobId, {
              $set: {'account.type': Account.SHARED}
            })

            break;
          case 'code':
            $('.code.field').fadeIn();
            self.data.job.account = {
              type: Account.PIN,
              accountPIN: null
            }
            self.data.selectedAccount.set(Account.PIN);
            Jobs.update(jobId, {
              $set: {'account.type': Account.PIN}
            })

            break;
          default:
            console.warn('nothing selected.')
        }
      }

    }
  });

  $('.account-selection .ui.dropdown').dropdown({
    onChange: function(value, text, $choice) {
      // self.data.sharedAccountId = value;
      console.log(text)
      self.data.selectedShared.set(text);
      Jobs.update(jobId, {
        $set: {'account.accountId': text}
      })
    }
  });

});
