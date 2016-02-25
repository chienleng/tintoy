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

Template.fileUpload.helpers({
  threeD: function() {
    console.log(Template.instance().data)
    var labId = Template.instance().data.labId();
    var lab = GetLab(labId);
    return !_.isUndefined(lab) && lab.name === "3D Print Lab" ? true : false;
   }
})

Template.fileUpload.onRendered(function() {
  var user = null;
  var labId = null;
  var self = this;
  var $fileUploadZone = $('#file-upload-zone');
  var $progressBar = $('#file-upload-progress');

  $progressBar.hide();

  self.autorun(function() {
    user = GetUser(self.data.userId());
    labId = self.data.labId();
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
      var mimeType = Blobs[0].mimeType;
      Blobs[0].viewerUrl = 'https://www.filestackapi.com/api/preview/' + fileId;
      Blobs[0].infoUrl = 'https://www.filepicker.io/api/file/'+fileId+'/convert?getpdfinfo=true';
      Blobs[0].docPreviewUrl = 'https://www.filestackapi.com/api/file/'+fileId;

      newJob.user = user;
      newJob.files = Blobs;
      newJob.added = new Date();
      newJob.labId = labId;

      if (mimeType === 'application/sla') {
        newJob.type = JobType.THREE_D;
        newJob.settings = {
          colour: Session.get('3dColour'),
          additionalInstructions: ''
        };
      } else {
        newJob.type = JobType.OTHER;
        newJob.settings = {
          copiesPages: {
            copies: 1,
            twoSided: true,
            size: 'A4',
            paperColour: 'White',
            type: 'Normal'
          },
          finishing: {
            collate: {
              type: "Don't collate",
              bind: 'Comb',
              frontCover: 'None',
              backCover: 'None'
            }
          },
          proofCopy: 'Email PDF Proof',
          delivery: 'Pick-up',
          additionalInstructions: ''
        }
      }
      var jobId = Jobs.insert(newJob);

      FlowRouter.go('/users/' + user._id +'/labs/' + labId + '/submit/' + jobId);

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
