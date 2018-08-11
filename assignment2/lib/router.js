
//Dependencies
var handlers = require('./handlers');

var router = {
  "ping" : handlers.ping,
  "notFound" : handlers.notFound,
  "users" : handlers.users,
  "tokens" : handlers.tokens,
  "items" : handlers.items,
  "shoppingCart" : handlers.shoppingCarts
};

module.exports = router;
