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

// USER routes
var userRoutes = FlowRouter.group({
  prefix: "/user",
  name: 'user'
});
userRoutes.route('/:userId', {
  action: function(params) {
    BlazeLayout.render("user", {
      userId: params.userId
    })
  }
});
userRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("userSettings");
  }
});

// OPERATOR routes
var operatorRoutes = FlowRouter.group({
  prefix: "/operator",
  name: 'operator'
});
operatorRoutes.route('/', {
  action: function(params) {
    BlazeLayout.render("operator");
  }
});
operatorRoutes.route('/job/:jobId', {
  action: function(params) {
    BlazeLayout.render("job", {
      jobId: params.jobId
    })
  }
});
operatorRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("operatorSettings")
  }
});

// NOT FOUND route

// NOT LOGINED IN
