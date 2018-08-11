//Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var inputValidator = require('./inputValidator');

var tokenHandler = {};

tokenHandler.tokens = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) != -1){
    tokenHandler._tokens[data.method](data,callback);
  }else{
    callback(405);
  }
};

tokenHandler._tokens = {};


tokenHandler._tokens.get = function(data,callback){

  var id = inputValidator.validate(data.queryStringObject.id,inputValidator.fieldNames.TOKEN_ID);

  if(id){
    _data.read('tokens',id,function(err,tokenObject){
      if(!err && tokenObject){
        callback(200,tokenObject);
      }else{
        callback(404,{'Error' : 'Could not find token'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required field'});
  }
};

//Required : id and extends
tokenHandler._tokens.put = function(data,callback){

  var id = inputValidator.validate(data.payload.id,inputValidator.fieldNames.TOKEN_ID);
  var extend = inputValidator.validate(data.payload.extend,inputValidator.fieldNames.EXTEND);

  if(id && extend){
    _data.read('tokens',id,function(err,tokenObject){
      if(!err && tokenObject){
        //Do not update tokens which are already expired.
        if(tokenObject.expires > Date.now()){
            tokenObject.expires = Date.now() + 60*60*1000;

            _data.update('tokens',id,tokenObject,function(err){
              if(!err){
                callback(200);
              }else{
                callback(500,{'Error' : 'Error while updating token'});
              }
            });
        }else{
          callback(400,{'Error' : 'Can not update expired tokens'})
        }
      }else{
        callback(400,{'Error' : 'Specified token does not exists'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required fields'});
  }
};

//Create new token.
//Required data : email and password.
tokenHandler._tokens.post = function(data,callback){

  var password = inputValidator.validate(data.payload.password,inputValidator.fieldNames.PASSWORD);
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);

  if(email && password){
    _data.read('users',email,function(err,userData){
      if(!err && userData){
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword){
          var tokenId = helpers.createRandomString(20);
          var tokenObject = {
            id : tokenId,
            email : userData.email,
            expires : Date.now() + 60 * 60 * 1000
          };
          _data.create('tokens',tokenId,tokenObject,function(err){
            if(!err){
              callback(200,tokenObject);
            }else{
              callback(500,{'Error' : 'Failed to create token'});
            }
          });
        }else{
          callback(400,{'Error' : 'Incorrect password'});
        }
      }else{
        callback(400,{'Error' : 'Could not find the user'});
      }
    });
  }else{
    callback(400,{'Error': 'Missing required fields'});
  }
};

//Required id.
tokenHandler._tokens.delete = function(data,callback){

  var id = inputValidator.validate(data.queryStringObject.id,inputValidator.fieldNames.TOKEN_ID);

  if(id){
    _data.read('tokens',id,function(err,data){
      if(!err && data){
        _data.delete('tokens',id,function(err){
          if(!err){
            callback(200);
          }else{
            callback(500,{'Error' : 'Could not delete the token'});
          }
        });

      }else{
        callback(400,{'Error' : 'Could not find the token'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};
tokenHandler.verifyTokens = function(tokenId,email,callback){

  _data.read('tokens',tokenId,function(err,tokenObject){
    if(!err && tokenObject){
      if(tokenObject.email == email && tokenObject.expires > Date.now()){
        callback(true);
      }else{
        callback(false);
      }
    }else{
      callback(false);
    }
  });
};
module.exports = tokenHandler;
