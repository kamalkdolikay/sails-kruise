/**
     * Module dependencies.
     */
    var promisify = require('bluebird').promisify,
    passport = require('passport'),
    oauth2orize = require('oauth2orize'),

    PublicClientPasswordStrategy = require('passport-oauth2-public-client').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,

    server = oauth2orize.createServer(), // create OAuth 2.0 server service
    validateAndSendToken = promisify(server.token()),
    tokenErrorMessage = server.errorHandler(),

    //Handlers
    publicClientVerifyHandler,
    bearerVerifyHandler,
    exchangePasswordHandler,
    exchangeRefreshTokenHandler;

    /**
     * Public Client strategy
     *
     * The OAuth 2.0 public client authentication strategy authenticates clients
     * using a client ID. The strategy requires a verify callback,
     * which accepts those credentials and calls done providing a client.
     */

    publicClientVerifyHandler = function (clientId, next) {
        process.nextTick(function () {
            API.Model(Clients).findOne({client_id: clientId}).nodeify(next);
        });
    };

    /**
     * BearerStrategy
     *
     * This strategy is used to authenticate either users or clients based on an access token
     * (aka a bearer token).  If a user, they must have previously authorized a client
     * application, which is issued an access token to make requests on behalf of
     * the authorizing user.
     */
    bearerVerifyHandler = function(token, next) {
        process.nextTick(function () {
            Tokens.authenticate({access_token:token}).nodeify(function (err, info) {
                if (!info || !info.identity) return next(null, null);
                next(null, info.identity, info.authorization);
            });
        });
    };

    /**
     * Exchange user id and password for access tokens.
     *
     * The callback accepts the `client`, which is exchanging the user's name and password
     * from the token request for verification. If these values are validated, the
     * application issues an access token on behalf of the user who authorized the code.
     */
    exchangePasswordHandler = function(client, username, password, scope, next) {
        if (!client) return next(null, false); //passport-oauth2-client-password needs to be configured
        //Validate the user
        Users.authenticate(username, password).then(function (user) {
            if (!user) return next(null, false);
            return Tokens.generateToken({
                client_id: client.client_id,
                user_id: user.id
            }).then(function (token) {
                return next(null, token.access_token, token.refresh_token, {
                    expires_in: token.calc_expires_in()
                });
            });
        });
    };

    /**
     * Exchange the refresh token for an access token.
     *
     * The callback accepts the `client`, which is exchanging the client's id from the token
     * request for verification.  If this value is validated, the application issues an access
     * token on behalf of the client who authorized the code
     */
    exchangeRefreshTokenHandler = function (client, refreshToken, scope, done) {

        API.Model(Tokens).findOne({
            refresh_token: refreshToken
        }).then(function (token) {
            if (!token) return done(null, null);

            return Tokens.generateToken({
                user_id: token.user_id,
                client_id: token.client_id
            }).then(function (token) {
                return done(null, token.access_token, token.refresh_token, {
                    expires_in: token.calc_expires_in()
                });

            });
        }).catch(function (err) {
            console.error(err);
            done(err);
        });

    };

    //Initialize Passport Strategies
    passport.use(new PublicClientPasswordStrategy(publicClientVerifyHandler));
    passport.use(new BearerStrategy(bearerVerifyHandler));
    server.exchange(oauth2orize.exchange.password(exchangePasswordHandler));
    server.exchange(oauth2orize.exchange.refreshToken(exchangeRefreshTokenHandler));

    module.exports = {
        authenticator: passport,
        server: server,

        //OAuth Token Services
        sendToken: function (data, context, req, res) {
            if (req.method != 'POST') throw 'Unsupported method';

            return validateAndSendToken(req, res).catch(function (err) {
                tokenErrorMessage(err, req, res);
            });
        },

        tokenInfo: function (data, context) {
            var token = context.authorization.token;
            token.expires_in = token.calc_expires_in();
            return {
                identity: context.identity,
                authorization: context.authorization
            };
        }
    };