var Promise = require('bluebird'),
    promisify = Promise.promisify,
    smtpTransport = require('nodemailer-smtp-transport'),
    nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(smtpTransport({
    host: sails.config.appSMTP.host,
    port: sails.config.appSMTP.port,
    debug: sails.config.appSMTP.debug,
    auth: {
            user: sails.config.appSMTP.auth.user,
            pass: sails.config.appSMTP.auth.pass
        }
}));

module.exports = {

    add: function(data, context, req, res){
        let query = data;

        Products.create(query).then(function(product){
            if(!_.isEmpty(product)){
                return res.jsonx({
                    success: true,
                    messsage: "PRODUCT_ADDED",
                    data: product
                });
            } else {
                return res.jsonx({
                    success: false,
                    error: {
                        message: "SOME_ERROR_OCCURED"
                    }
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });

    },

    update: function(data, context, req, res){
        let query = {id: data.id};

        Products.update(query,data).then(function(product){
            if(!_.isEmpty(product)){
                return res.jsonx({
                    success: true,
                    message: "PRODUCT_UPDATED",
                    data: product
                });
            } else {
                return res.jsonx({
                    success: false,
                    error: {
                        message: "PRODUCT_NOT_FOUND"
                    }
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });

    },

    remove: function(data, context, req, res){
        let query = {id:data.id};

        Products.update(query,{isDeleted: true}).then(function(product){
            if(!_.isEmpty(product)){
                return res.jsonx({
                    success: true,
                    message: "PRODUCT_DELETED",
                    data: product
                });
            } else {
                return res.jsonx({
                    success: false,
                    error: {
                        message: "PRODUCT_NOT_FOUND"
                    }
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });
    },

    list: function(data, context, req, res){
        let query = {isDeleted:false};

        Products.find(query).populate('seller').then(function(product){
            if(!_.isEmpty(product)){
                return res.jsonx({
                    success: true,
                    data: product
                });
            } else {
                return res.jsonx({
                    success: false,
                    error: {
                        message: "PRODUCT_NOT_FOUND"
                    }
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });
    },

    myproducts: function(data, context, req, res){
        var sortBy = data.sortBy;
        var count  = data.count;
        var query = {seller:data.seller, isDeleted:false};

        Products.find(query).populate('seller').sort(sortBy).limit(count).then(function(products){
            if(!_.isEmpty(products)){
                async.each(products, function(product, cb){
                    let query = {id: product.seller.id};

                    Users.find(query).then(function(user){
                        product.user = user[0].username;
                        cb();
                    }).fail(function(error){
                        return res.jsonx({
                            error: error
                        });
                    });

                },function(error){
                    if(error){
                        return res.jsonx({
                            success: false,
                            error: error
                        });
                    } else {
                        Products.count(query).then(function(producttotal){
                            if(_.isNumber(producttotal)){
                                return res.jsonx({
                                    success: true,
                                    data: {
                                        products: products,
                                        total: producttotal
                                    }
                                });
                            } else {
                                return res.jsonx({
                                    success: false,
                                    error: {
                                        message: "SOME_ERROR_OCCURED"
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                return res.jsonx({
                    success: false,
                    error: {
                        message: "PRODUCT_NOT_FOUND"
                    }
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });
    },

    approve: function(data, context, req, res){
        let query = {id:data.id};

        Products.update(query,{isApproved: true}).then(function(product){
            if(!_.isEmpty(product)){
                Users.findOne(product[0].seller).then(function(user){
                    if(!_.isEmpty(user)){
                        var message = 'Hello ' + user.username;
                        message += '<br /><br />';
                        message += 'Your product ' + product[0].name + ' is approved by KD and now available for others users for bidding';
                        message += '<br /><br />';
                        message += '<br /><br />';
                        message += 'Regards';
                        message += '<br /><br />';
                        message += 'Team KD';

                        transport.sendMail({
                            from: sails.config.appSMTP.auth.user,
                            to: user.email,
                            subject: 'Product Approved',
                            html: message
                        }, function(error, info){
                            if(error){
                                return res.jsonx({
                                    success: false,
                                    error: error
                                });
                            } else {
                                return res.jsonx({
                                    success: true,
                                    message: "PRODUCT_APPROVED",
                                    data: user
                                });
                            }
                        });
                    } else {
                        return res.jsonx({
                            success: false,
                            message: "USER_NOT_FOUND"
                        });
                    }

                }).fail(function(error){
                    return res.jsonx({
                        error: error
                    });
                });
            } else {
                return res.jsonx({
                    success: false,
                    message: "PRODUCT_NOT_FOUND"
                });
            }

        }).fail(function(error){
            return res.jsonx({
                error: error
            });
        });
    }
};