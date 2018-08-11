//Dependencies
var _data = require('./data');
var inputValidator = require('./inputValidator');
var tokenHandler = require('./tokenHandler');

var itemHandler = {};

//Hardcoding the items for now.
itemHandler._availableItems = [
  "Paneer Soya Supreme",
  "Veg Exotica",
  "Veggie Italiano",
  "Veggie Supreme",
  "Chicken Exotica",
  "Chicken Italiano",
  "Chicken Supreme"
];

itemHandler.items = function(data,callback){
  var acceptableMethods = ["get"];
  if(acceptableMethods.indexOf(data.method) != -1){
    itemHandler._items[data.method](data,callback);
  }else{
    callback(405,'Method not allowed.');
  }
};

itemHandler._items = {};

itemHandler._items.get = function(data,callback){
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);
  var email = inputValidator.validate(data.queryStringObject.email,inputValidator.fieldNames.EMAIL);
  //Validate the token.
  if(email && token){
    tokenHandler.verifyTokens(token,email,function(validity){
      if(validity){
        callback(200,itemHandler._availableItems);
      }else{
        callback(403,{'Error' : 'Invalid token'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};

module.exports = itemHandler;
