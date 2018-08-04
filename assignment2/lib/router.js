
//Dependencies
var handlers = require('./handlers');

var router = {
  "ping" : handlers.ping,
  "notFound" : handlers.notFound,
  "users" : handlers.users,
  "tokens" : handlers.tokens,
  "checks" : handlers.checks
};

module.exports = router;
