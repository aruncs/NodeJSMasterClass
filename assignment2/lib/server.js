
//Dependencies.
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

var config = require('./config');
var router = require('./router');
var helpers = require('./helpers');

var server = {};

//http server
server.httpServer = http.createServer(function(req,res){
    server.unifiedServer(req,res);
});

//https server
server.httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res){
  server.unifiedServer(req,res);
})

server.unifiedServer = function(req,res){

  //Extract information from request.
  var parsedUrl = url.parse(req.url,true);

  var path = parsedUrl.pathname;

  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  var queryStringObject = parsedUrl.query;

  var headers = req.headers;

  var method = req.method.toLowerCase();

  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });

  req.on('end',function(){

    buffer += decoder.end();
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router['notFound'];

    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data,function(statusCode,payload){
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      payload = typeof(payload) === 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);

      res.end(payloadString);

      console.log("Returning: ",statusCode,payloadString);
    });
  });
};

server.init = function(){
  //Start listening to the respective ports.
  server.httpServer.listen(config.httpPort,function(){
    console.log("server listening on port " + config.httpPort + " in " + config.envName + " mode");
  });

  server.httpsServer.listen(config.httpsPort,function(){
    console.log("server listening on port " + config.httpsPort + " in " + config.envName + " mode");
  });

};

module.exports = server;
