/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'verify/:email': function(req,res){
        API(UsersService.verifyUser,req,res);
    },

    current: function(req,res){
        API(UsersService.currentUser,req,res);
    },

    signin: function(req, res){
        API(UsersService.signinUser, req, res);
    },

    signup: function(req, res){
        API(UsersService.signupUser, req, res);
    }
};