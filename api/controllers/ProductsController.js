/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    add: function(req, res){
        API(ProductsService.add, req, res);
    },

    update: function(req, res){
        API(ProductsService.update, req, res);
    },

    delete: function(req, res){
        API(ProductsService.remove, req, res);
    },

    list: function(req, res){
        API(ProductsService.list, req, res);
    },

    myproducts: function(req, res){
        API(ProductsService.myproducts, req, res);
    },

    approve: function(req, res){
        API(ProductsService.approve, req, res);
    }

};