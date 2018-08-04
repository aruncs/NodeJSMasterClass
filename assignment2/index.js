
//Dependencies
var server = require('./lib/server');

var app = {};

app.init = function(){

  //Start the server
  server.init();

};

app.init();

module.exports = app;
