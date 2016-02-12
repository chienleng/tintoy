// USER routes
var userRoutes = FlowRouter.group({
  prefix: "/users",
  name: 'user'
});
// userRoutes.route('/:userId', {
//   action: function(params) {
//     BlazeLayout.render("user", {
//       userId: params.userId
//     })
//   }
// });
userRoutes.route('/:userId/labs/:labId', {
  action: function(params) {
    BlazeLayout.render("user", {
      userId: params.userId,
      labId: params.labId
    });
  }
});
userRoutes.route('/:userId/labs/:labId/submit/:jobId', {
  action: function(params) {
    BlazeLayout.render("jobSubmission", {
      userId: params.userId,
      jobId: params.jobId,
      labId: params.labId
    })
  }
});
userRoutes.route('/:userId/labs/:labId/jobs/:jobId', {
  action: function(params) {
    BlazeLayout.render("userJob", {
      userId: params.userId,
      jobId: params.jobId,
      labId: params.labId
    });
  }
});

userRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("userSettings");
  }
});
