//Dependencies

var inputValidator = {};

inputValidator.fieldNames = {
  "FIRST_NAME" : "firstName",
  "LAST_NAME" : "lastName",
  "EMAIL" : "email",
  "PASSWORD" : "password",
  "ADDRESS" : "address",
  "TOKEN_ID" : "id",
  "EXTEND" : "extend",
  "ITEMS" : "items"
};

inputValidator._validateFirstName = function(firstName){
   return typeof(firstName) == 'string' && firstName.trim().length > 0 ? firstName.trim() : false;
};

inputValidator._validateLastName = function(lastName){
  return typeof(lastName) == 'string' && lastName.trim().length > 0 ? lastName.trim() : false;
};

inputValidator._validateEmail = function(email){
  //TODO: validate email using regex.
  return typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false;
};

inputValidator._validateAddress = function(address){
  return typeof(address) == 'string' && address.trim().length > 0 ? address.trim() : false;
};

inputValidator._validatePassword = function(password){
  return typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false;
};

inputValidator._validateTokenId = function(tokenId){
  return typeof(tokenId) == 'string' && tokenId.trim().length == 20 ? tokenId.trim() : false;
};

inputValidator._validateExtend = function(extend){
  return typeof(extend) == 'boolean' && extend == true ? true : false;
};

inputValidator._validateItems = function(items){
  //console.log(items);
  return typeof(items) == 'object' && items instanceof Object && Object.getOwnPropertyNames(items).length ? items : false;
};

//Performs sanity check on the user input and returns the same value if everything is ok. return false otherwise.
inputValidator.validate = function(value,fieldName){
  switch (fieldName) {
    case inputValidator.fieldNames.FIRST_NAME:
      value = inputValidator._validateFirstName(value);
      break;
    case inputValidator.fieldNames.LAST_NAME:
      value = inputValidator._validateLastName(value);
      break;
    case inputValidator.fieldNames.ADDRESS:
      value = inputValidator._validateAddress(value);
      break;
    case inputValidator.fieldNames.EMAIL:
      value = inputValidator._validateEmail(value);
      break;
    case inputValidator.fieldNames.PASSWORD:
      value = inputValidator._validatePassword(value);
      break;
    case inputValidator.fieldNames.TOKEN_ID:
      value = inputValidator._validateTokenId(value);
      break;
    case inputValidator.fieldNames.EXTEND:
      value = inputValidator._validateExtend(value);
      break;
    case inputValidator.fieldNames.ITEMS:
      value = inputValidator._validateItems(value);
      break;
    default:
      value = false;
  }
  return value;
};
module.exports = inputValidator;
