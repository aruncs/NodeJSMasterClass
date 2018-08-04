
var crypto = require('crypto');
var config = require('./config');

var helpers = {};

helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  }else{
    return false;
  }
};

helpers.parseJsonToObject = function(str){
    try {
      var obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
};

helpers.createRandomString = function(length){

  length = typeof(length) == 'number' && length > 0 ? length : false;
  if(length){

    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var str = '';
    for(var i = 0 ; i < length ; i++){
      str += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }
  }
  return str;
}

module.exports = helpers;
