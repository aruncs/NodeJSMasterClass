var inputValidator = require('../lib/inputValidator');
var https = require('https');
var querystring = require('querystring')
var config = require('../lib/config');
var StringDecoder = require('string_decoder').StringDecoder;
var stripe = {};

//Paylod should contain currency, amount, description and source.
stripe.charge = function(currency,amount,description,source,callback){

    //currency = inputValidator.validate(currency,inputValidator.fieldNames.CURRENCY);
    //amount = inputValidator.validate(amount,inputValidator.fieldNames.AMOUNT);
    //description = inputValidator.validate(description,inputValidator.fieldNames.TEXT);
    //console.log(amount);
    //source = inputValidator.validate(source,inputValidator.fieldNames.STRIPE_TOKEN);

    if(currency && amount && description && source){

      var Paylod = {
        'currency' : currency,
        'amount' : amount,
        'description' : description,
        'source' : source
      };

      var stringPayload = querystring.stringify(Paylod);

      var requestDetails = {
        'protocol' : 'https:',
        'hostname' : 'api.stripe.com',
        'method' : 'POST',
        'path' : '/v1/charges',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload),
            'Authorization': 'Bearer ' + config.externalService.stripe.apiKey
          }
      };

      var req = https.request(requestDetails,function(res){
        //console.log(body);
        var status = res.statusCode;
        var decoder = new StringDecoder('utf-8');
        var dataBuffer = '';
        res.on('data',function(data){
            dataBuffer += decoder.write(data);
            //console.log(dataBuffer);
        });

        res.on('end',function(){
          dataBuffer += decoder.end();
          //console.log(dataBuffer);
          console.log(dataBuffer.paid);
          if(dataBuffer.paid){
            callback(false);
          }else{
            callback('Payment failed');
          }

        });
      });

      req.on('error',function(err){
        callback(err);
      });

      //Add payload to the request.
      req.write(stringPayload);

      req.end();

    }else{
      console.log("Helllooooo");
      callback('Missing required field');
    }
};

module.exports = stripe;
