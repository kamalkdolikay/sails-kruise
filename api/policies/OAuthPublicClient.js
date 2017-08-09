module.exports = function (req, res, next) {
    OAuthService.authenticator.authenticate(
        ['oauth2-public-client'],
        { session: false })(req,res,next);
};