var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

// Securable endpoints: list the endpoints which you want to make securable here
var securableEndpoints = ['assets'];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

/**
 * Assets endpoints for dealing with RESTful assets requests
 */
app.use('/assets', require('./lib/assets.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

// When this service starts up we need to check that our collection exists.
// If it doesn't, we will create it
var bootstrapper = require('./lib/bootstrapper');

bootstrapper.bootstrapData();

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
module.exports = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
