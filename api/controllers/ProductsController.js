/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    addProduct: function(req, res){
        API(ProductsService.add, req, res);
    },

    updateProduct: function(req, res){
        API(ProductsService.update, req, res);
    },

    deleteProduct: function(req, res){
        API(ProductsService.delete, req, res);
    }
	
};

