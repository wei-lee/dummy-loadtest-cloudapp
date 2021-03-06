var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var prom = require('prom-client');

// list the endpoints which you want to make securable here
var securableEndpoints = [
  '/fhcache',
  '/fhdb',
  'fhstats',
  '/metrics'
];

var app = express();

// putting this first so that it's run first
app.use(require('./lib/prom-middleware.js'));

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/fhdb', require('./lib/fhdb.js')());
app.use('/fhcache', require('./lib/fhcache.js')());
app.use('/fhstats', require('./lib/fhstats.js')());

app.use('/metrics', function(req, res) {
  res.end(prom.register.metrics());
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
