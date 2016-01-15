// login
FlowRouter.route('/', {
  action: function(params) {
    BlazeLayout.render("home");
  }
});
FlowRouter.route('/account', {
  action: function(params) {
    BlazeLayout.render("account");
  }
});
FlowRouter.route('/test/3d', {
  action: function(params) {
    BlazeLayout.render("test3d");
  }
});
FlowRouter.route('/test/upload', {
  action: function(params) {
    BlazeLayout.render("testFileUpload");
  }
});
