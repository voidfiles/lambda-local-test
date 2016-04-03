'use strict';

var joule = require('./joule');

joule.get('/', function (event, context, res) {
  res.send('Got it ');
});


module.exports = joule;
