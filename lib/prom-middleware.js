var prom = require('prom-client');

var histogram = new prom.histogram('cloudapp_requests', 'cloudapp_requests_histogram', ['endpoint', 'method']);

module.exports = function prometheusExpress(req, res, next) {
  var route = req.permissionpath || req.route || req.path || req.url;
  route = route.replace(new RegExp("\\/[\\w-]{24}(\\/|\\?|$)"), '/:guid');
  console.log(route);
  var endTimer = histogram.labels(route, req.method).startTimer();

  res._end = res.end;
  res.end = function(data, encoding, callback) {
    res._end(data, encoding, callback);
    endTimer();
  };

  return next();
};
