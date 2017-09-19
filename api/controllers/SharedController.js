/**
 * SharedController
 *
 * @description :: Server-side logic for managing shareds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    upload: function(req, res) {
        API(SharedService.uploadImage, req, res);
    }
};