// USER routes
var userRoutes = FlowRouter.group({
  prefix: "/users",
  name: 'user'
});
userRoutes.route('/:userId', {
  action: function(params) {
    BlazeLayout.render("user", {
      userId: params.userId
    })
  }
});
userRoutes.route('/:userId/submit/:jobId', {
  action: function(params) {
    BlazeLayout.render("jobSubmission", {
      userId: params.userId,
      jobId: params.jobId
    })
  }
});
userRoutes.route('/:userId/jobs/:jobId', {
  action: function(params) {
    BlazeLayout.render("userJob", {
      userId: params.userId,
      jobId: params.jobId
    });
  }
});
userRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("userSettings");
  }
});
