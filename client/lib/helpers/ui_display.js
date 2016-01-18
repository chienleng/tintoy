/* dates */
Template.registerHelper('calendarDate', function(date) {
  return moment(date).calendar();
});
Template.registerHelper('fromNow', function(date) {
  return moment(date).fromNow();
});

/* user names */
Template.registerHelper('fullName', function(names) {
  return names.given + " " + names.surname;
});
