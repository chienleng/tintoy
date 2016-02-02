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
operatorRoutes.route('/labs/:labId', {
  action: function(params) {
    BlazeLayout.render("operator", {
      labId: params.labId
    })
  }
});
operatorRoutes.route('/jobs/', {
  action: function(params) {
    BlazeLayout.render("jobList")
  }
});
operatorRoutes.route('/jobs/:jobId', {
  action: function(params) {
    BlazeLayout.render("operatorJob", {
      jobId: params.jobId,
      menuItem: 'All Jobs' // <-- redo this
    })
  }
});
operatorRoutes.route('/settings', {
  action: function(params) {
    BlazeLayout.render("operatorSettings")
  }
});
