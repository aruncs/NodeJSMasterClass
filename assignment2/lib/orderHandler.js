var stripe = require('../externalService/stripe');
var mailgun = require('../externalService/mailgun');
var helper = require('./helpers');
var _data = require('./data');
var inputValidator = require('./inputValidator');
var tokenHandler = require('./tokenHandler');
var itemHandler = require('./itemHandler');

var orderHandler = {};

orderHandler.orders = function(data,callback){
  var acceptableMethods = ['post'];
  if(acceptableMethods.indexOf(data.method) != -1){
    orderHandler._orders[data.method](data,callback);
  }else{
    callback(405);
  }
};

orderHandler._orders = {};

// 1. Create Order in database
// 2. Update user data with orders
// 3. Make the Payment
// 4. Update the status once the payment is successfull.
// 5. Send order confirmation to the user.
// 6. Delete the shopping cart
orderHandler._orders.post = function(data,callback){
  var email = inputValidator.validate(data.payload.email,inputValidator.fieldNames.EMAIL);
  var token = inputValidator.validate(data.headers.token,inputValidator.fieldNames.TOKEN_ID);

  if(email && token){
    tokenHandler.verifyTokens(token,email,function(valid){
    if(valid){
        //Read the cart for items in the order.
      _data.read('shoppingCarts',email,function(err,cart){
        if(!err && cart){

          //read all the item details to calculate price in the order.
          _data.read('items','items',function(err,itemsDetails){
            //Create order.
            var orderDetails = orderHandler._orders.convertCartToOrder(cart,itemsDetails);
            _data.create('orders',orderDetails.orderId,orderDetails,function(err){
              if(!err){
                _data.read('users',email,function(err,userDetails){
                  if(!err && userDetails){

                    if(!userDetails.orders){
                      userDetails.orders = [];
                    }
                    userDetails.orders.push(orderDetails.orderId);

                    _data.update('users',email,userDetails,function(err){
                      if(!err){
                        //make payment. amount should is send in cents
                        stripe.charge('usd',orderDetails.totalPrice*100,orderDetails.orderId,'tok_visa',function(err){
                          if(!err){
                            console.log('Payment successfull for order ' + orderDetails.orderId);
                            //update the order with new payment status.
                            orderDetails.paymentStatus = true;
                            _data.update('orders',orderDetails.orderId,orderDetails,function(err){
                              if(!err){
                                //TODO:send email.
                                var subject = 'Order confirmation: ' + orderDetails.orderId;
                                var text = 'This is to confirm that we have received your order with order id: ' + orderDetails.orderId + ' and will be dispatched soon!! Thank you for your order!!!';
                                mailgun.sendEmail('Excited User <excited@samples.mailgun.org>', email, subject, text,function(err){
                                  if(!err){
                                    //delete the cart.
                                    _data.delete('shoppingCarts',email,function(err){
                                      if(!err){
                                        callback(200);
                                      }else{
                                        callback(500,{'Error' : 'Failed to delete shopping cart'});
                                      }
                                    })
                                  }else{
                                    console.log(err);
                                    callback(500,{'Error' : 'Failed to send email'});
                                  }
                                });
                                //callback(200);
                              }else{
                                callback(500,{'Error' : 'Failed to update order status'});
                              }
                            });
                          }else{
                            //console.log(err);
                            callback(500,{'Error' : err});
                          }
                        });
                      }else{
                        callback(500,{'Error' : 'Failed to update user details'});
                      }
                    });
                  }else{
                    callback(500,{'Error' : 'Failed to read user data'});
                  }
                });
              }else{
                callback(500,{'Error' : 'Failed to create order'});
              }
            });
          });
        }else{
          callback(500,{'Error' : 'Failed to read cart details'});
        }
      });
    }else{
      callback(403,"Invalid token");
    }
  });
  }else{

    callback(400,{'Error' : 'Missing required fields'});
  }
};
orderHandler._orders.convertCartToOrder = function(cartDetails,itemsDetails){
  var orderId = helper.createRandomString(20);
  var orderDetails = {
    "orderId" : orderId,
    "items" : {

    },
    "totalPrice" : 0,
    "paymentStatus" : false
  }

  Object.getOwnPropertyNames(cartDetails).forEach(function(cartItem){
    var itemDetail = itemsDetails[cartItem];

    orderDetails.items[cartItem] = {
      "itemId" : cartItem,
      "quantity" : cartDetails[cartItem],
      "price" : itemDetail.price * cartDetails[cartItem]
    }
    orderDetails.totalPrice += orderDetails.items[cartItem].price;

  });
  return orderDetails;
};
module.exports = orderHandler;
