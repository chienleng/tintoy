Template.jobModal.helpers({
  selectedJob: function() {
    var job = Template.instance().data.selectedJob.get();
    return _.isUndefined(job) ? {} : job;
  },
  selectedJobId: function() {
    return Template.instance().data.selectedJobId.get();
  },
  fileUrl: function() {
    var job = Template.instance().data.selectedJob.get();
    return (_.isUndefined(job)) ? "" : job.files[0].url;
  },
  docPreviewUrl: function() {
    var job = Template.instance().data.selectedJob.get();
    return (_.isUndefined(job)) ? "" : job.files[0].viewerUrl;
  },
  threeD: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
  },
  pdf: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/pdf" ? true : false;
  },
  image: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && _.contains(ImageTypes, fileObj.mimetype) ? true : false;
  },
  filename: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj ? fileObj.filename : "";
  },
  filesize: function() {
    var job = Template.instance().data.selectedJob.get();
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj ? (fileObj.size / 1000).toFixed(0) + "KB" : "n/a";
  },
  showCost: function() {
    var type = Session.get('type');
    return type === 'done';
  },
  showRejectReason: function() {
    var type = Session.get('type');
    return type === JobStatus.REJECTED;
  },
  showMessage: function() {
    var type = Session.get('type');
    // return type === JobStatus.REJECTED || type === JobStatus.DONE || type === JobStatus.ACCEPTED;
    return true;
  },
  isRejectedSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.REJECTED ? 'selected' : '';
  },
  isDoneSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.DONE ? 'selected' : '';
  },
  isAcceptedSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.ACCEPTED ? 'selected' : '';
  },
  isIncomingSelected: function() {
    var type = Session.get('type');
    return type === JobStatus.INCOMING ? 'selected' : '';
  },
  accountTypeSelection: function(){
    var job = Template.instance().data.selectedJob.get();
    var string = "";

    if (_.isUndefined(job)) {
      string += ""
    } else {
      string += job.account.type;
      if (job.account.type === "Shared") {
        string += " — " + job.account.accountId;
      }
    }
    return string;
  },
  deliverySelection: function() {
    var job = Template.instance().data.selectedJob.get();
    var delivery = null;
    var string = ""
    if (!_.isUndefined(job)) {
      delivery = job.settings.delivery;
      string += delivery;
      if (delivery !== 'Pick-up') {
        string += ' — ' + job.settings.deliveryAddress;
      }
    }
    return string;
  },
  copiesPagesSelection: function(){
    var job = Template.instance().data.selectedJob.get();
    var copiesPages = null;
    var string = ""
    if (!_.isUndefined(job)) {
      copiesPages = job.settings.copiesPages;
      string += copiesPages.copies + (copiesPages.copies > 1 ? " copies" : " copy") + ", ";
      string += (copiesPages.twoSided ? "Two-Sided" : "Single-Sided") + ", ";
      string += copiesPages.size + ", ";
      string += copiesPages.paperColour + ", ";
      string += copiesPages.type
    }
    return string;
  },
  finishingSelection: function(){
    var job = Template.instance().data.selectedJob.get();
    var finishing = null;
    var string = ""
    if (!_.isUndefined(job)) {
      finishing = job.settings.finishing.collate;
      if (finishing.type === 'Bind') {
        string +=  finishing.bind + " binding, ";
      } else if (finishing.type === 'Fold' && !_.isUndefined(finishing.fold)) {
        string += finishing.fold + " fold";
      } else {
        string += finishing.type;
        if (finishing.type === 'Staple') {
          string += ", ";
        }
      }

      if (finishing.type !== "Don't collate" && finishing.type !== "Fold") {
        string += "Front: " + finishing.frontCover + ", ";
        string += "Back: " + finishing.backCover;
      }
    }
    return string;
  },

});

Template.jobModal.onRendered(function() {
  var self = this;
  var jobId = this.data.selectedJobId.get();
  var job = GetJob(jobId);


  $('#job-status-selection').on('change', function() {
    console.log($(this).val());
    Session.set('type', $(this).val());
  });

  $('.update-job.button').on('click', function() {
    jobId = this.data.selectedJobId.get();
    var type = Session.get('type');
    var message = $('#job-status-message').val();
    console.log(jobId);
    console.log(type);
    console.log(message)
    AddJobLog(jobId, type, message);
    $('#job-status-message').val("");
  }.bind(this));

  // TODO: refactor...
  var viewer = null;
  var JSC3D = JSC3DWrapper();
  var obj = null;

  var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
  var isThreeD = fileObj && fileObj.mimetype === "application/sla" ? true : false;

  if (isThreeD) {
    getJobDetailsAndRender(jobId)
  }

  this.autorun(function() {
    jobId = this.data.selectedJobId.get();
    job = GetJob(jobId);
    fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    isThreeD = fileObj && fileObj.mimetype === "application/sla" ? true : false;

    if (isThreeD) {
      getJobDetailsAndRender(jobId);
    }
  }.bind(this));

  function getJobDetailsAndRender(jobId) {
    var job = GetJob(jobId);
    var hasJob = !_.isUndefined(job);
    var colour = hasJob && !_.isUndefined(job.settings.colour) ?
      job.settings.colour : Session.get('3dColour');

    if (hasJob) {
      if (viewer) {
        // var mesh = viewer.getScene().getChildren()[0];
        // var hexNumber = parseInt(colour.replace(/^#/, ''), 16);
        // mesh.setMaterial(new JSC3D.Material('', 0, hexNumber, 0, true));
        // viewer.update();
        viewer = null;
        render(job.files[0].url, colour);
      } else {
        setTimeout(function() {
          render(job.files[0].url, colour);
        }, 1000);
      }
    }
  }

  function render(fileUrl, colour) {
    var previewClass = '.preview';
    var preview3DClass = '.preview-3d';
    var canvas = null;
    // var width = $(previewClass).width() || 300;
    // console.log(width);
    // // set canvas width based on its container
    // $(previewClass).find(preview3DClass).attr('width', width)
    // render the 3D file
    canvas = $('.preview .preview-3d')[0];
    viewer = new JSC3D.Viewer(canvas);
    viewer.setParameter('InitRotationY', 45);
    viewer.setParameter('InitRotationZ', 45);
    viewer.setParameter('ModelColor', colour);
    viewer.setParameter('BackgroundColor1', '#efefef');
    viewer.setParameter('BackgroundColor2', '#efefef');
    viewer.setParameter('RenderMode', 'smooth');
    viewer.setParameter('MipMapping', JSC3D.PlatformInfo.supportWebGL ? 'off' : 'on');
    viewer.setParameter('Renderer', 'webgl');
    viewer.init();
    viewer.update();

    var stlLoader = new JSC3D.StlLoader(
      function(load) {
        obj = load;
        viewer.replaceScene(obj);
      },
      function() {},
      function() {},
      function(resource) {
        console.log(resource)
      });
    stlLoader.loadFromUrl('/get/file?url=' + fileUrl);
  }
})
