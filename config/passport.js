var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var EXPIRES_IN = 60*60*24;
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var ALGORITHM = "HS256";
var ISSUER = "nozus.com";
var AUDIENCE = "nozus.com";

var LOCAL_STRATEGY_CONFIG = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
};

var JWT_STRATEGY_CONFIG = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: SECRET,
    issuer: ISSUER,
    audience: AUDIENCE,
    passReqToCallback: false
};

function _onLocalStrategyAuth(email, password, next){
    Users.findOne({email: email}).exec(function(error, user){
        if(error) return next(error, false, {});

        if(!user) return next(null, false, {
            code: 'E_USER_NOT_FOUND',
            message: email + ' is not found'
        });

        if(!CipherService.comparePassword(password, user))
            return next(null, false, {
                code: 'E_WRONG_PASSWORD',
                message: 'Password is wrong'
            });

        return next(null, user, {});
    });
}

function _onJwtStrategyAuth(payload, next){
    var user = payload.user;
    return next(null, user, {});
}

passport.use(new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));

module.exports.jwtSettings = {
    expiresIn: EXPIRES_IN,
    secret: SECRET,
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE
}