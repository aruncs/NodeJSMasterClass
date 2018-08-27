var inputValidator = require('../lib/inputValidator');
var https = require('https');
var querystring = require('querystring')
var config = require('../lib/config');
var StringDecoder = require('string_decoder').StringDecoder;

var mailgun = {};

mailgun.sendEmail = function(from,to,subject,text,callback){

  from = inputValidator.validate(from,inputValidator.fieldNames.EMAIL);
  to = inputValidator.validate(to,inputValidator.fieldNames.EMAIL);
  subject = inputValidator.validate(subject,inputValidator.fieldNames.TEXT);
  text = inputValidator.validate(text,inputValidator.fieldNames.TEXT);

  if(from && to && subject && text){
    var payload = {
      'to' : to,
      'from' : from,
      'subject' : subject,
      'text' : text
    };

    var stringPayload = querystring.stringify(payload);

    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.mailgun.net',
      'method' : 'POST',
      'path' : '/v3/sandbox4425abcffc00418481f2dc6899fd151a.mailgun.org/messages',
      'auth': 'api:' + config.externalService.mailgun.apiKey,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload),
          'Authorization': "Basic " + Buffer.from("api:" + config.externalService.mailgun.apiKey).toString("base64")
        }
    };

    var req = https.request(requestDetails,function(res){
      console.log(res);
      var status = res.statusCode;
      var decoder = new StringDecoder('utf-8');
      var dataBuffer = '';
      if(status == 200 || status == 201){
        callback(false);
      }else{
        callback('Failed to send mail');
      }
      // res.on('data',function(data){
      //     //console.log('Hello how are you');
      //     dataBuffer += decoder.write(data);
      //     //console.log(dataBuffer);
      // });

      // res.on('end',function(){
      //
      //   dataBuffer += decoder.end();
      //   console.log(dataBuffer);
      //   var response = JSON.parse(dataBuffer);
      //   //console.log(response);
      //   //callback(false);
      //   if(response.statusCode == 200){
      //     callback(false);
      //   }else{
      //     callback('Failed to send mail');
      //   }
      //
      // });
    });

    req.on('error',function(err){
      console.log(err);
      callback(err);
    });

    //Add payload to the request.
    req.write(stringPayload);

    req.end();

  }else{

    callback('Missing required data');
  }

};

module.exports = mailgun;
