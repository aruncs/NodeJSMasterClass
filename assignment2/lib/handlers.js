
//Dependencies.
var userHandler = require('./userHandler');
var tokenHandler = require('./tokenHandler');
var itemHandler = require('./itemHandler');
var shoppingCartHandler = require('./shoppingCartHandler');
var orderHandler = require('./orderHandler');

var handlers = {};

handlers.users = function(data,callback){
  userHandler.users(data,callback);
};

handlers.tokens = function(data,callback){
  tokenHandler.tokens(data,callback);
};

handlers.items = function(data,callback){
  itemHandler.items(data,callback);
};

handlers.shoppingCarts = function(data,callback){
  shoppingCartHandler.shoppingCarts(data,callback);
};

handlers.orders = function(data,callback){
  orderHandler.orders(data,callback);
};
handlers.notFound = function(data,callback){
  callback(404);
};

handlers.ping = function(data,callback){
  callback(200);
};

module.exports = handlers;
