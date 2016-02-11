Template.view3D.helpers({
  job: function() {
    return GetJob(Template.instance().data.jobId());
  },
  accountType: function() {
    var type = this.account.type;
    if (type === Account.SHARED) {
      var sharedAccount = GetAccount(this.account.accountId);
      if (!_.isUndefined(sharedAccount)) {
        type = 'Shared Account: ' + sharedAccount.label;
      }
    }
    return type;
  }
});

Template.view3D.events({

});
