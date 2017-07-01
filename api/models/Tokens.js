/**
 * Tokens.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var randToken = require('rand-token');

module.exports = {

  attributes: {

    access_token: {
      type: 'string',
      required: true,
      unique: true
    },

    refresh_token: {
      type: 'string',
      required: true,
      unique: true
    },

    code: {
      type: 'string',
      unique: true
    },

    user_id: {
      type: 'string'
    },

    expiration_date: {
      type: 'date'
    },

    client_id: {
      type: 'string',
      required: true
    },

    security_level: {
      tyepe: 'string'
    },

    scope: {
      type: 'string'
    }

  },

  expires_in: function (){
      return Math.floor(new Date(this.expiration_date).getTime() / 1000 - new Date().getTime() / 1000)
    },

    toJSON: function (){
      var hiddenValues = [ 'id', 'access_token', 'refresh_token', 'code', 'user_id', 'client_id' ];
          obj = this.toObject();

      obj.expires_in = this.expires_in();

      hiddenValues.forEach(function(property){
        console.log("property", property)
      });

      return obj;
    },

    generateTokenString: function (){
      return randToken.generate(sails.config.security.oauth.token.length);
    },

    generateToken: function ( data ){
      console.log("data", data)
      var token = {},
          accessToken,
          $Token = API.Model(Tokens);

      token.client_id = data.client_id;
      token.user_id = data.user_id;
      token.access_token = this.generateTokenString();
      token.refresh_token = this.generateTokenString();
      token.code = this.generateTokenString();

      return $Token.findOrCreate(data, token).then(function(result){
        console.log("result", result);
        return token;
      })
    }
};

