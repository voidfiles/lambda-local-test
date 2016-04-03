'use strict';

var jouleApp = require('./index');


module.exports.myHandler = function (event, context) {
  return jouleApp.router.routeForLambda(event, context);
};
