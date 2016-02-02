Template.preview3D.helpers({
  filename: function() {
    var fileObj = GetFileByJobId(Template.instance().data.jobId());
    return fileObj ? fileObj.filename : "";
  },
  filesize: function() {
    var fileObj = GetFileByJobId(Template.instance().data.jobId());
    return fileObj ? (fileObj.size/1000).toFixed(0) + "KB" : "n/a";
  }
});

Template.preview3D.onRendered(function() {
  var viewer = null;
  var JSC3D = JSC3DWrapper();
  var obj = null;

  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());

     var hasJob = !_.isUndefined(this.data.job);
     var colour = hasJob && !_.isUndefined(this.data.job.settings.colour) ?
                          this.data.job.settings.colour : Session.get('3dColour');

     if (hasJob) {
       if (viewer) {
         var mesh = viewer.getScene().getChildren()[0];
         var hexNumber = parseInt(colour.replace(/^#/, ''), 16);
         mesh.setMaterial(new JSC3D.Material('', 0, hexNumber, 0, true));
         viewer.update();
       } else {
         render(this.data.job.files[0].url, colour);
       }
     }
  }.bind(this));

  function render(fileUrl, colour) {
    var previewClass = '.preview';
    var preview3DClass = '.preview-3d';
    var canvas = null;
    // set canvas width based on its container
    $(previewClass).find(preview3DClass).attr('width', $(previewClass).width());

    // render the 3D file
    canvas = $(preview3DClass)[0];
    viewer = new JSC3D.Viewer(canvas);
    viewer.setParameter('InitRotationY', 45);
    viewer.setParameter('InitRotationZ', 45);
    viewer.setParameter('ModelColor', colour);
    viewer.setParameter('BackgroundColor1', '#FFFFFF');
    viewer.setParameter('BackgroundColor2', '#FFFFFF');
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

  // $(window).on('resize', function() {
  //   $('.preview').find('..preview-3d').attr('width', $('.preview').width());
  //
  //   /* TODO: this call re-downloads the file everytime, need to find a better way. */
  //   if (viewer) {
  //     render();
  //   }
  // });

})
