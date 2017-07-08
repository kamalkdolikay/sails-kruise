/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {
  schema: true,
  attributes: {
      username: {
        type: 'string',
        required: true,
        unique: true,
        alphanumericdashed: true
      },

      password: {
        type: 'string',
        required: true,
        columnName: 'encryptedPassword',
        minLength: 8
      },

      email: {
        type: 'string',
        email: true,
        required: true,
        unique: true
      },

      firstName: {
        type: 'string',
        defaultsTo: ''
      },

      lastName: {
        type: 'string',
        defaultsTo: ''
      },

      image: {
        type: 'string',
        defaultsTo: '',
        url: true
      },

      socialProfiles: {
        type: 'object',
        defaultsTo: {}
      },

      toJSON: function(){
        var obj = this.toObject();
        delete obj.password;
        delete obj.socialProfiles;
        return obj;
      }
  },

  beforeUpdate: function(values, next){
    CipherService.hashPassword(values);
    next();
  },

  beforeCreate: function(values, next){
    CipherService.hashPassword(values);
    next();
  }
};

