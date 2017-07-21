/**
 * OAuthController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	token: function(req,res){
        API(OAuthService.sendToken,req,res);
    },

    'token-info': function(req,res){
        API(OAuthService.tokenInfo,req,res);
    }
};

