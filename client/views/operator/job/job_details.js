// Template.jobDetails.helpers({
//   jobNum: function() {
//     return getSelectedJob().jobNum;
//   },
//   jobName: function() {
//     var selectedJob = getSelectedJob();
//     var filename = selectedJob.filename;
//     var customName = selectedJob.customName;
//     return customName === '' ? filename : customName + ' ('+filename+')';
//   },
//   filename: function() {
//     return getSelectedJob().filename;
//   },
//   customName: function() {
//     return getSelectedJob().customName;
//   },
//   pickupDate: function() {
//     return getSelectedJob().pickupDate;
//   },
//   submitted: function() {
//     return getSelectedJob().submitted;
//   },
//   userId: function() {
//     return getSelectedJob().userId;
//   }
// });
//
// Template.jobDetails.events({
//   "click .approve.button": function(event, template) {
//     Jobs.update(getSelectedJob()._id, {
//       $set: {
//         status: 'accepted'
//       }
//     });
//   },
//   "click .reject-confirm.button": function(event, template) {
//     console.log('here')
//     Jobs.update(getSelectedJob()._id, {
//       $set: {
//         status: 'rejected'
//       }
//     });
//   }
// });
//
// Template.jobDetails.onCreated(function() {
//   console.log('created')
// });
//
// Template.jobDetails.onRendered(function() {
//   console.log('rendered')
// });
//
// function getSelectedJob() {
//   var jobId = Session.get('selectedJob');
//   console.log(Jobs.findOne(jobId))
//   return Jobs.findOne(jobId);
// }
