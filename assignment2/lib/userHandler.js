
//Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var inputValidator = require('./inputValidator');
var tokenHandler = require('./tokenHandler');

var userHandler = {};

//Request dispatcher for user.
userHandler.users = function(data,callback){

  var acceptableMethods = ["post","get","put","delete"];
  if(acceptableMethods.indexOf(data.method) != -1){
    userHandler._users[data.method](data,callback);
  }else{
    callback(405,'Method not allowed.');
  }
};

userHandler._users = {};

//Required data : first name, last name, password, email,address
userHandler._users.post = function(data,callback){
  //Validate user input
  var firstName = inputValidator.validate(data.payload.firstName,inputValidator.fieldNames.FIRST_NAME);
  var lastName = inputValidator.validate(data.payload.lastName,inputValidator.fieldNames.LAST_NAME);
  var password = inputValidator.validate(data.payload.password,inputValidator.fieldNames.PASSWORD);
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var address = inputValidator.validate(data.payload.address,inputValidator.fieldNames.ADDRESS);

  if(firstName && lastName && email && address && password){
    //Check if a user already exists with this email id.
    console.log(_data);
    _data.read('users',email,function(err,userData){
        if(err){
          var userData = {
            'firstName' : firstName,
            'lastName' : lastName,
            'hashedPassword' : helpers.hash(password),
            'email' : email,
            'address' : address
          };
          //create users
          _data.create('users',email,userData,function(err){
            if(!err){
              callback(200);
            }else{
              console.log(err);
              callback(500,{'Error' : 'Failed to create new user'});
            }
          });
        }else{
          callback(400,{'Error' : 'User with this email id already exists'});
        }
    });
  }else{
    callback(400,{'Error' : 'Missing required fields'});
  }
};
// Required : email
userHandler._users.get = function(data,callback){

  var email = inputValidator.validate(data.queryStringObject.email,inputValidator.fieldNames.EMAIL);
  //var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email : false;
  if(email){

    //Validate the user. allow only user to see his/her information.
    var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);
    if(token){
      tokenHandler.verifyTokens(token,email,function(validity){
        if(validity){
          _data.read('users',email,function(err,data){
            if(!err && data){
                //Remove hashedPassword from the data object.
                delete data.hashedPassword;

                callback(200,data);
            }else{
                callback(404,{'Error' : 'User does not exists'});
            }
          });
        }else{
          callback(403,{'Error' : 'Invalid token'});
        }
      });
    }else{
      callback(403,{'Error' : 'Forbidden'});
    }
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};

//
userHandler._users.put = function(data,callback){

  var firstName = inputValidator.validate(data.payload.firstName,inputValidator.fieldNames.FIRST_NAME);
  var lastName = inputValidator.validate(data.payload.lastName,inputValidator.fieldNames.LAST_NAME);
  var password = inputValidator.validate(data.payload.password,inputValidator.fieldNames.PASSWORD);
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var address = inputValidator.validate(data.payload.address,inputValidator.fieldNames.ADDRESS);

  if(email){
    //Validate the user. allow only user to update his/her own information.
    var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);
    if(token){
      tokenHandler.verifyTokens(token,email,function(validity){
        if(validity){
          _data.read('users',email,function(err,data){
            if(!err && data){
              if(firstName || lastName || password || address){
                if(firstName){
                  data.firstName = firstName;
                }

                if(lastName){
                  data.lastName = lastName;
                }

                if(password){
                  data.password = helpers.hash(password);
                }

                if(address){
                  data.address = address;
                }
                _data.update('users',email,data,function(err){
                  if(!err){
                    callback(200);
                  }else{
                    callback(500,{'Error' : 'Failed to update the user info'});
                  }
                });
              }else{
                callback(400,{'Error' : 'At least one property has to be provided for update'});
              }
            }else{
              callback(400,{'Error' : 'User does not exists'});
            }
          });
        }else{
          callback(403,{'Error' : 'Invalid token'});
        }
      });
    }else{
      callback(403,{'Error' : 'Forbidden'});
    }
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};

//Required: email
userHandler._users.delete = function(data,callback){

  var email = inputValidator.validate(data.queryStringObject.email,inputValidator.fieldNames.EMAIL);

  if(email){
    var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);
    if(token){
      tokenHandler.verifyTokens(token,email,function(validity){
        if(validity){
          _data.read('users',email,function(err,data){
            if(!err && data){
              _data.delete('users',email,function(err){
                if(!err){
                  callback(200);
                }else{
                  callback(500,{'Error' : 'Failed to delete the user'});
                }
              });
            }else{
              callback(400,{'Error' : 'Could not find the user'});
            }
          });
        }else{
          callback(403,"forbidden");
        }
      });
    }else{
      callback(403,"Token not valid");
    }
  }else{
    callback(400,{'Error' : 'Missing required data'});
  }
};
module.exports = userHandler;
