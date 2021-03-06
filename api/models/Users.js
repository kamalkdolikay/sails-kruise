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
  autoCreatedAt: true,
  autoUpdatedAt: true,

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

      firstname: {
        type: 'string',
        defaultsTo: ''
      },

      lastname: {
        type: 'string',
        defaultsTo: ''
      },

      fullname: {
        type: 'string',
        defaultsTo: ''
      },

      address: {
          type: 'string',
          defaultsTo: ''
      },

      city: {
          type: 'string',
          defaultsTo: ''
      },

      state: {
          type: 'string',
          defaultsTo: ''
      },

      country: {
          type: 'string',
          defaultsTo: ''
      },

      pincode: {
          type: 'integer',
          defaultsTo: ''
      },

      mobile: {
          type: 'integer',
          defaultsTo: ''
      },

      image: {
        type: 'string',
        defaultsTo: ''
      },

      location: {
          type: 'string'
      },

      date_registered: {
          type: 'date'
      },

      date_verified: {
          type : 'date'
      },

      comparePassword: function(password) {
          return bcrypt.compareSync(password, this.password);
      },

      toJSON: function() {

          var obj = this.toObject();
          delete obj.password;

          return obj;
      }
  },

  beforeCreate: function(user, next) {
      if (user.hasOwnProperty('password')) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
          next(false, user);

      } else {
          next(null, user);
      }
  },


  beforeUpdate: function(user, next) {
      if (user.hasOwnProperty('password')) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
          next(false, user);
      } else {
          next(null, user);
      }
  },

  authenticate: function (username, password) {
      return API.Model(Users).findOne({username: username}).then(function(user){
          return (user && user.date_verified && user.comparePassword(password))? user : null;
      });
  }

  //to be used with CipherService, passport
  /*beforeUpdate: function(values, next){
    CipherService.hashPassword(values);
    next();
  },

  beforeCreate: function(values, next){
    CipherService.hashPassword(values);
    next();
  }*/
};

