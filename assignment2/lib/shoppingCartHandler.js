//Dependencies
var _data = require('./data');
var tokenHandler = require('./tokenHandler');
var inputValidator = require('./inputValidator');
var helpers = require('./helpers');

var shoppingCartHandler = {};

shoppingCartHandler._shoppingCarts = {};

shoppingCartHandler.shoppingCarts = function(data,callback){
  var acceptableMethods = ["post","get","put","delete"];
  if(acceptableMethods.indexOf(data.method) != -1){
    shoppingCartHandler._shoppingCarts[data.method](data,callback);
  }else{
    callback(405,'Method not allowed.');
  }
};
// Required: email,token.
shoppingCartHandler._shoppingCarts.get = function(data,callback){
  var email = inputValidator.validate(data.queryStringObject.email,inputValidator.fieldNames.EMAIL);
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);

  if(email && token){
    tokenHandler.verifyTokens(token,email,function(valid){
      if(valid){
        _data.read('shoppingCarts',email,function(err,shoppingCart){
          if(!err && shoppingCart){
            callback(200,shoppingCart);
          }else{
            callback(500,{'Error' : 'Failed to read shopping cart'});
          }
        });
      }else{
        callback(403,"Invalid token");
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }

};
// Required: email,token,items.
// items will be an object where keys will be the item key(in this case name of the item) and value will be the quantity.
shoppingCartHandler._shoppingCarts.post = function(data,callback){
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);

  var items = inputValidator.validate(data.payload.items,inputValidator.fieldNames.ITEMS);

  if(email && token && items){
    tokenHandler.verifyTokens(token,email,function(valid){
      if(valid){
        _data.create('shoppingCarts',email,items,function(err){
          if(!err){
            callback(200);
          }else{
            callback(500,{'Error' : 'Failed to create shopping cart'});
          }
        });
      }else{
        callback(403,"Invalid token");
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};
// Required: email,token,items.
// items will be an object where keys will be the item key(in this case name of the item) and value will be the quantity.
// a quantity zero indicate that the itme need to be removed from the cart.
shoppingCartHandler._shoppingCarts.put = function(data,callback){
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);

  var items = inputValidator.validate(data.payload.items,inputValidator.fieldNames.ITEMS);

  if(email && token && items){
    tokenHandler.verifyTokens(token,email,function(valid){
      if(valid){
        _data.read('shoppingCarts',email,function(err,shoppingCart){
          if(!err && shoppingCart){
            Object.getOwnPropertyNames(items).forEach(function(item){
              // if the quantity is not zero, update it. otherwise delete the item.
              if(items[item]){
                shoppingCart[item] = items[item];
              }else{
                delete shoppingCart[item];
              }

            });
            _data.update('shoppingCarts',email,shoppingCart,function(err){
              if(!err){
                callback(200);
              }else{
                callback(500,{'Error' : 'Failed to update shopping cart'});
              }
            });
          }else{
            callback(500,{'Error' : 'Failed to read shopping cart'});
          }
        });
      }else{
        callback(403,"Invalid token");
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};

shoppingCartHandler._shoppingCarts.delete = function(data,callback){
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);

  if(email && token && items){
    tokenHandler.verifyTokens(token,email,function(valid){
      if(valid){
        _data.delete('shoppingCarts',email,function(err){
          if(!err){
            callback(200);
          }else{
            callback(500,{'Error' : 'Failed to delete shopping cart'});
          }
        });
      }else{
        callback(403,"Invalid token");
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};


module.exports = shoppingCartHandler;
