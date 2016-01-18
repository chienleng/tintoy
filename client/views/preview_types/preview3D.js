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
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
     console.log(this.data.job);

     if (!_.isUndefined(this.data.job)) {
       render(this.data.job.files[0].url);
     }
  }.bind(this));

  function render(fileUrl) {
    var previewClass = '.preview .card';
    var preview3DClass = '.preview-3d';
    var viewer = null, canvas = null;
    var JSC3D = JSC3DWrapper();

    // set canvas width based on its container
    $(previewClass).find(preview3DClass).attr('width', $(previewClass).width());

    // render the 3D file
    canvas = $(preview3DClass)[0];
    viewer = new JSC3D.Viewer(canvas);
    viewer.setParameter('InitRotationY', 0);
    viewer.setParameter('InitRotationZ', 0);
    viewer.setParameter('ModelColor', '#16CBF3');
    viewer.setParameter('BackgroundColor1', '#333333');
    viewer.setParameter('BackgroundColor2', '#333333');
    viewer.setParameter('RenderMode', 'smooth');
    viewer.setParameter('MipMapping', JSC3D.PlatformInfo.supportWebGL ? 'off' : 'on');
    viewer.setParameter('Renderer', 'webgl');
    viewer.init();
    viewer.update();

    var stlLoader = new JSC3D.StlLoader(
      function(load) {
        viewer.replaceScene(load)
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
