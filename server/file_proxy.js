// https://www.filestackapi.com/api/file/KyoZnTxkQZWXwQQ33umy
var request = Meteor.npmRequire('request');
var url = Meteor.npmRequire('url');

WebApp.connectHandlers.use(function(req, res, next) {
  // path needs to end with .stl to work in the renderer
  if (url.parse(req.url, true).pathname !== '/fileme.stl') {
    return next();
  }

  // this is a stil file
  var x = request("http://www.filestackapi.com/api/file/KyoZnTxkQZWXwQQ33umy");
  req.pipe(x).pipe(res);
})
