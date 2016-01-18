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

/* file Obj */
Template.registerHelper('filename', function(files) {
  var fileObj = (!_.isUndefined(files) && files.length > 0) ? files[0] : null; // assume single file
  return fileObj ? fileObj.filename : "";
});
Template.registerHelper('downloadLink', function(files) {
  var fileObj = (!_.isUndefined(files) && files.length > 0) ? files[0] : null; // assume single file
  return fileObj ? fileObj.downloadLink : "";
});
Template.registerHelper('filesize', function(files) {
  var fileObj = (!_.isUndefined(files) && files.length > 0) ? files[0] : null; // assume single file
  return fileObj ? (fileObj.size/1000).toFixed(0) + "KB" : "n/a";
});
