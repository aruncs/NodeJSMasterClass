//dependencies

var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');


var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir,file,data,callback){
  fs.open(lib.baseDir + dir + '/' + file + '.json','wx',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor,stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            }else{
              callback('Error closing the file');
            }
          })
        }else{
          callback('Error writing to new file');
        }
      })
    }else{
      callback('Could not create file.It may already exists\n');
    }
  });
};

lib.read = function(dir,file,callback){
  fs.readFile(lib.baseDir + dir + '/' + file +'.json', 'utf8', function(err,data){
    if(!err && data){
      var parsedData = helpers.parseJsonToObject(data);
      callback(false,parsedData);
    }else{
      callback(err,data);
    }
  });
};

//Update
lib.update = function(dir, file, data,callback){
  fs.open(lib.baseDir + dir + '/' + file + '.json','r+',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          fs.writeFile(fileDescriptor,stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                }else{
                  callback('Error closing file');
                }
              });
            }else{
              callback('Error writing to file');
            }
          });
        }else{
          callback('Error truncating file');
        }
      });
    }else{
      callback('Could not open the file');
    }
  });
};

//Delete
lib.delete = function(dir,file,callback){
  fs.unlink(lib.baseDir + dir + '/' + file + '.json',function(err){
    if(!err){
      callback(false);
    }else{
      callback('Error deleting the file');
    }
  });
};
//export module
module.exports = lib;
