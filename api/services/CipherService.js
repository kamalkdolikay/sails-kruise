var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = {
    secret: sails.config.jwtSettings.secret,
    issuer: sails.config.jwtSettings.issuer,
    audience: sails.config.jwtSettings.audience,

    hashPassword: function(user){
        if(user.password){
            user.password = bcrypt.hashSync(user.password);
        }
    },

    comparePassword: function(password, user){
       return user.password = bcrypt.compareSync(password, user.password);
    },

    createToken: function(user){
        return jwt.sign({
            user: user.toJSON()
        },
        sails.config.jwtSettings.secret,
        {
            algorithm: sails.config.jwtSettings.alorithm,
            expiresIn: sails.config.jwtSettings.expiresIn,
            issuer: sails.config.jwtSettings.issuer,
            audience: sails.config.jwtSettings.audience
        });
    }
};