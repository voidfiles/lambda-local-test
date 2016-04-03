'use strict';

var JouleApp = require('./joule/index');

var myApp = new JouleApp();

myApp.router.get('/', function (event, context, res) {
  res.send('Got it ');
});


module.exports = myApp;
