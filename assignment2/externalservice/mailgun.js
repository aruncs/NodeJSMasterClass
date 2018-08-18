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

    var stringPayload = querystring.stringify(Paylod);

    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.mailgun.net/v3/samples.mailgun.org',
      'method' : 'POST',
      'path' : '/messages',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload),
          'Authorization': 'api ' + config.externalService.mailgun.apiKey
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
        console.log("Hello: "  + dataBuffer);

        // if(dataBuffer.status === "succeeded"){
        //   callback(false);
        // }else{
        //   callback('Failed to send mail');
        // }

      });
    });

    req.on('error',function(err){
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
