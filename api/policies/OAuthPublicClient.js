module.exports = function (req, res, next) {
    OAuth.authenticator.authenticate(
        ['oauth2-public-client'],
        { session: false })(req,res,next);
};