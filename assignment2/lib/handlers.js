
//Dependencies.
var userHandler = require('./userHandler');
var tokenHandler = require('./tokenHandler');

var handlers = {};

handlers.users = userHandler.users;

handlers.tokens = tokenHandler.tokens;

handlers.notFound = function(data,callback){
  callback(404);
};

handlers.ping = function(data,callback){
  callback(200);
};

module.exports = handlers;
