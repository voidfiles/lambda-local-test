'use strict';

var Router = require('i40');
var Response = require('joule-node-response');
var _ = require('lodash');
var url = require('url');

var JouleRouter = function () {
  this.routes = {};
};

JouleRouter.prototype.addRouteForMethod = function (method, path, cb) {
  method = method.toUpperCase();

  if (!this.routes[method]) {
    this.routes[method] = new Router();
  }

  this.routes[method].addRoute(path, cb);

};
var initalMethods = ['get', 'post', 'put', 'delete'];

_(initalMethods).forEach(function(method) {
  JouleRouter.prototype[method] = function (path, cb) {
    return this.addRouteForMethod(method, path, cb);
  };
});

JouleRouter.prototype.routePath = function (method, path) {
  if (!this.routes[method]) {
    return null;
  }

  var match = this.routes[method].match(path);
  if (!match) {
    return null;
  }

  return match.fn;
};

var LocalResponse = function(res) {
  this.response = res;
};

LocalResponse.prototype.setContentType = function (contentType) {
  this.response.setHeader('Content-Type', contentType);
};

LocalResponse.prototype.setContext = function (){};

LocalResponse.prototype.setHttpStatusCode = function(code) {
  var reason;
  // https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html
  switch(code) {
    case 200:
      reason = 'OK';
      break;
    case 201:
      reason = 'Created';
      break;
    case 202:
      reason = 'Accepted';
      break;
    case 400:
      reason = 'Bad Request';
      break;
    case 401:
      reason = 'Unauthorized';
      break;
    case 403:
      reason = 'Forbidden';
      break;
    case 404:
      reason = 'Not Found';
      break;
    case 409:
      reason = 'Conflict';
      break;
    default:
      reason = 'Unknown';
      break;
  }
  this.response.statusCode = code;
  this.response.statusMessage = reason;
};


LocalResponse.prototype.send = function(data) {
  var contentType = this.response.getHeader('content-type');
  if(typeof(this.response.statusCode) === 'undefined') {
    this.setHttpStatusCode(200);
  }
  if(typeof(contentType) === 'undefined') {
    this.setContentType('application/json');
  }

  this.response.end(data);
};


JouleRouter.prototype.routeForLocal = function (req, res) {
  var path = url.parse(req.url).pathname;
  var cb = this.routePath(req.method, path);
  var response = new LocalResponse(res);
  var event = {};
  var context = {};
  if (!cb) {
    response.send('');
    return;
  }

  return cb(event, context, response);
};

JouleRouter.prototype.routeForLambda = function (event, context) {
  var path = url.parse(event.url).pathname;
  var cb = this.routePath(event.method, path);
  var response = Response();

  if (!cb) {
    response.send('');
    return;
  }

  return cb(event, context, response);
};

module.exports = JouleRouter;
