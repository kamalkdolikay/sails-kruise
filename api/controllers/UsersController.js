/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    register: function(req, res){
        API(Registeration.register, req, res);
    },

    login: function(req, res){
        API(Registeration.login, req, res);
    }
};

