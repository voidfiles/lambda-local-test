'use strict';

var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');



var httpApp = connect();
var jouleApp = require('./index');

// respond to all requests
httpApp.use('/api', function(req, res){
  // res.end('Hello from Connect!\n');
  jouleApp.router.routeForLocal(req, res);
});

var staticCode = serveStatic('public/');

httpApp.use(staticCode);

//create node.js http server and listen on port
http.createServer(httpApp).listen(3000);
