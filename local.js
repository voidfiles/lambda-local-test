'use strict';

var connect = require('connect');
var http = require('http');

var app = connect();
var jouleApp = require('./index');

// respond to all requests
app.use(function(req, res){
  // res.end('Hello from Connect!\n');
  jouleApp.routeForLocal(req, res);
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
