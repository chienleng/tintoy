var request = Meteor.npmRequire('request');
var url = Meteor.npmRequire('url');

WebApp.connectHandlers.use(function(req, res, next) {
  var parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname !== '/get/file') {
    return next();
  }
  var x = request(parsedUrl.query.url);
  req.pipe(x).pipe(res);
})
