/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {

  attributes: {

      username: {
        type: 'string',
        required: true
      },

      password: {
        type: 'string',
        required: true,
        columnName: 'encryptedPassword',
        minLength: 8
      }
  }
};

