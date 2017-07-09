var Promise = require('bluebird'),
    promisify = Promise.promisify,
    mailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    emailGeneratedCode,
    transporter;


transporter = mailer.createTransport(smtpTransport({
                host: sails.config.appSMTP.host,
                port: sails.config.appSMTP.port,
                debug: sails.config.appSMTP.debug,
                auth: {
                        user: sails.config.appSMTP.auth.user, //access using /congig/appSMTP.js
                        pass: sails.config.appSMTP.auth.pass
                    }
            }));

var emailGeneratedCode = function (options) {
    var url = options.verifyURL,
        email = options.email;


    message = 'Hello!';
    message += '<br/>';
    message += 'Please visit the verification link to complete the registration process.';
    message += '<br/><br/>';
    message += 'Account with ' + options.type + " : " + options.id;
    message += '<br/><br/>';
    message += '<a href="';
    message += url;
    message += '">Verification Link</a>';
    message += '<br/>';

    transporter.sendMail({
        from: sails.config.security.admin.email.address,
        to: email,
        subject: 'Canadian Tire App Account Registration',
        html: message
    }, function (err, info) {
        console.log("Email Response:", info);
    });

    return {
        url: url
    };
};

module.exports = {
    register: function(data){
        console.log("data", data);
        data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        return API.Model(Users).create(data).then(function(user){
            return {
                message: "success"
            };
        });
    },

    login: function(data){
        console.log("data",data);
        let username = data.username;
        return API.Model(Users).findOne({username:username}).then(function(user){
            console.log("user",user);
            if( user === undefined ){
                return {
                    success: false,
                    error: {
                        code: 404,
                        message: "user not found"
                    }
                };
            }

            if( !bcrypt.compareSync(data.password, user.password) ){
                return {
                    success: false,
                    error: {
                        code: 404,
                        message: "incorrect password"
                    }
                };
            } else {
                return Tokens.generateToken({
                        user_id: user.id,
                        client_id: Tokens.generateTokenString()
                    });
            }
        });
    },

    currentUser: function(data,context){
      return context.identity;
    },

    registerUser: function (data, context) {
        var date = new Date();
        return API.Model(Users).create({
            username: data.username,
            email: data.email,
            password: data.password,
            date_registered: date
        }).then(function (user) {
            context.id = user.username;
            context.type = 'Username';
            return Tokens.generateToken({
                user_id: user.id,
                client_id: Tokens.generateTokenString()
            });
        }).then(function (token) {
            return emailGeneratedCode({
                id: context.id,
                type: context.type,
                verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
                email: data.email
            });
        });

    },

    verifyUser: function (data, context) {
        return Tokens.authenticate({
            code: data.code,
            type: 'verification',
            email: data.email
        }).then(function (info) {
            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Users).update(
                {
                    username: info.identity.username
                },
                {
                    date_verified: date
                }
            );

            return {
                verified: true,
                email: info.identity.email
            }
        });
    },

    registerClient: function (data, context) {
        return API.Model(Clients).create({
            client_id: Tokens.generateTokenString(),
            client_secret: Tokens.generateTokenString(),
            email: data.email
        }).then(function (client) {
            context.id = client.client_id;
            context.type = 'Client ID';

            return Tokens.generateToken({
                client_id: client.client_id
            });
        }).then(function (token) {
            return emailGeneratedCode({
                id: context.id,
                type: context.type,
                verifyURL: sails.config.security.server.url + "/clients/verify/" + data.email + "?code=" + token.code,
                email: data.email
            });
        });
    },


    verifyClient: function (data, context) {
        return Tokens.authenticate({
            type: 'verification',
            code: data.code,
            email: data.email
        }).then(function (info) {
            var date = new Date();
            if (!info) return Promise.reject('Unauthorized');

            API.Model(Clients).update(
                {
                    client_id: info.identity.client_id
                },
                {
                    date_verified: date
                }
            );

            return {
                verified: true,
                email: info.identity.email
            };
        });
    }
}