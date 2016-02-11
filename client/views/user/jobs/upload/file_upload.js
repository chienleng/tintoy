var newJob = {
  jobNum: null,
  customName: '',
  files: [],
  user: null,
  pickupDate: null,
  added: null,
  submitted: null,
  account: {},
  settings: {}
}

Template.fileUpload.onRendered(function() {
  var user = null;
  var self = this;
  var $fileUploadZone = $('#file-upload-zone');
  var $progressBar = $('#file-upload-progress')

  $progressBar.hide();

  self.autorun(function() {
    user = GetUser(self.data.userId());
    filepicker.setKey(Session.get('filestackKey'));
  })

  filepicker.makeDropPane($('#file-upload-zone')[0], {
    dragEnter: function() {
      $fileUploadZone.find('.drop-zone').addClass('drop-target');
    },
    dragLeave: function() {
      $fileUploadZone.find('.drop-zone').removeClass('drop-target');
    },
    onSuccess: function(Blobs) {
      $progressBar.hide();
      $fileUploadZone.find('.drop-zone').fadeIn();
      $fileUploadZone.find('.drop-zone .description').text("Done, see result below");

      var fileId = Blobs[0].url.substring(Blobs[0].url.lastIndexOf("/")+1, Blobs[0].url.length);
      Blobs[0].viewerUrl = 'https://www.filestackapi.com/api/preview/' + fileId;
      Blobs[0].infoUrl = 'https://www.filepicker.io/api/file/'+fileId+'/convert?getpdfinfo=true';
      Blobs[0].docPreviewUrl = 'https://www.filestackapi.com/api/file/'+fileId;

      newJob.user = user;
      newJob.files = Blobs;
      newJob.added = new Date();
      var jobId = Jobs.insert(newJob);

      FlowRouter.go('/users/' + user._id +'/submit/' + jobId);

      // [{"url":"https://cdn.filestackcontent.com/4PLkBOltSbSgIv2pQzRq","filename":"diagram.pdf","mimetype":"application/pdf","size":4805044,"isWriteable":false}]
      // [{"url":"https://cdn.filestackcontent.com/Ki6XMGKcRpR4aCEap7XD","filename":"slotted_disk (1).stl","mimetype":"application/sla","size":82878,"isWriteable":false}]
    },
    onError: function(type, message) {
    },
    onProgress: function(percentage) {
      $fileUploadZone.find('.drop-zone').removeClass('drop-target').hide();
      $progressBar.fadeIn();
      $progressBar.progress({
        percent: percentage
      });
    }
  });

  // Randomly tada the upload icon.
  this.data.intervalId = Meteor.setInterval(function(){
     $('.file-upload-icon').transition('tada');
  }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);
});

Template.fileUpload.onDestroyed(function() {
  Meteor.clearInterval(this.data.intervalId);
})
