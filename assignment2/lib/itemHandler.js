//Dependencies
var _data = require('./data');
var inputValidator = require('./inputValidator');
var tokenHandler = require('./tokenHandler');

var itemHandler = {};

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
  var email = inputValidator.validate(data.headers.email,inputValidator.fieldNames.EMAIL);
  //Validate the token.
  if(email && token){
    tokenHandler.verifyTokens(token,email,function(validity){
      if(validity){
        _data.read('items','items',function(err,itemsDetails){
          if(!err && itemsDetails){
            callback(200,itemsDetails);
          }else{
            callback(500,{'Error' : 'Failed to read item details'});
          }
        });
      }else{
        callback(403,{'Error' : 'Invalid token'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};

module.exports = itemHandler;
