/**
 * OAuthController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	token: function(req,res){
        API(OAuth.sendToken,req,res);
    },

    'token-info': function(req,res){
        API(OAuth.tokenInfo,req,res);
    }
};

