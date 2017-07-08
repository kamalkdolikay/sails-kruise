/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

function _onPassportAuth(req, res, error, user, info){
    if(error) return res.serverError(error);
    if(!user) return res.unauthorized(null, info && info.code, info && info.message);

    return res.ok({
        token: CipherService.createToken(user),
        user: user
    });
}

module.exports = {

    signup: function(req, res){
        Users.create(_.omit(req.allParams(), 'id')).then(function(user){
            return {
                token: CipherService.createToken(user),
                user: user
            };
        })
        .then(res.created)
        .catch(res.serverError);
    },

    signin: function(req, res){
        passport.authenticate('local', _onPassportAuth.bind(this, req, res))(req, res);
    },

};

