/**
 * Products.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {

      name: {
          type: 'string',
          required: true
      },

      price: {
          type: 'string'
      },

      category: {
          type: 'string'
      },

      seller: {
          model: 'users'
      },

      image: {
          type: 'string'
      },

      isVerified: {
          type: 'boolean',
          defaultsTo: false
      },

      isApproved: {
          type: 'boolean',
          defaultsTo: false
      },

      isDeleted: {
          type: 'boolean',
          defaultsTo: false
      }
  }
};

