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

/* job */
Template.registerHelper('jobStatusUser', function(status) {
  var display = null;
  switch(status) {
    case JobStatus.PENDING:
      display = 'Not submitted';
      break;
    case JobStatus.ACCEPTED:
      display = 'Waiting to be printed';
      break;
    case JobStatus.REJECTED:
      display = 'Rejected';
      break;
    case JobStatus.DONE:
      display = 'Job printed';
      break;
    case JobStatus.RECEIVED:
      display = 'Received';
      break;
    case JobStatus.INCOMING:
      display = 'Submitted';
      break;
    default:
      display = '';
  }
  return display;
});
