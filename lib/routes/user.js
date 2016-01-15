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
