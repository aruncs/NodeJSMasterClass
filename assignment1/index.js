
// import all the required libs.
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./config');
var fs = require('fs');

var StringDecoder = require('string_decoder').StringDecoder;

//http server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
  });
httpServer.listen(config.httpPort,function(){
  console.log("server listening on port " + config.httpPort + " in " + config.envName + " mode");
});

//https server
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
})
httpsServer.listen(config.httpsPort,function(){
  console.log("server listening on port " + config.httpsPort + " in " + config.envName + " mode");
});

var handlers = {};
handlers.hello = function(data,callback){
  callback(200,"Hello, Welcome to the World of NodeJS!!!\n");
}

handlers.notFound = function(data,callback){
  callback(404,"Sorry, I don't understand your language!!!\n");
}

var router = {
  "hello" : handlers.hello
};

var unifiedServer = function(req,res){
  debugger;
  var parsedUrl = url.parse(req.url,true);

  var path = parsedUrl.pathname;

  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  var decoder = new StringDecoder('utf-8');

  var chosenRouteHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

  chosenRouteHandler(null,function(statusCode,payload){

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(payload);

    console.log("Returning: ",statusCode,payload);
  });
};
