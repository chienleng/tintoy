Template.thumbnail3D.onRendered(function() {
  render(this.data._id, this.data.files[0].url);

  function render(id, fileUrl) {
    var previewClass = '[data-id='+id+'] .preview-column';
    var preview3DClass = '[data-id='+id+'] .preview-3d';
    var viewer = null, canvas = null;
    var JSC3D = JSC3DWrapper();

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
});
