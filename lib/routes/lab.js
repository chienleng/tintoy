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
operatorRoutes.route('/:labId', {
  action: function(params) {
    BlazeLayout.render("operator", {
      labId: params.labId
    })
  }
});
// operatorRoutes.route('/jobs/:jobId', {
//   action: function(params) {
//     BlazeLayout.render("job", {
//       jobId: params.jobId
//     })
//   }
// });
operatorRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("operatorSettings")
  }
});
