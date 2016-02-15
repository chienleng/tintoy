Template.thumbnail3D.onRendered(function() {
  var colour = _.isUndefined(this.data.settings.colour) ? '#16CBF3' : this.data.settings.colour;
  // render(this.data._id, this.data.files[0].url, colour);

  function render(id, fileUrl, colour) {
    var preview3DClass = '[data-id='+id+'] .preview-3d';
    var viewer = null, canvas = null;
    var JSC3D = JSC3DWrapper();

    // render the 3D file
    canvas = $(preview3DClass)[0];
    viewer = new JSC3D.Viewer(canvas);
    viewer.setParameter('InitRotationY', 45);
    viewer.setParameter('InitRotationZ', 45);
    viewer.setParameter('ModelColor', colour);
    viewer.setParameter('BackgroundColor1', '#eeeeee');
    viewer.setParameter('BackgroundColor2', '#eeeeee');
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
