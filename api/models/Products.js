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

      product_id: {
          type: 'string'
      },

      product_sku: {
          type: 'string'
      },

      product_name: {
          type: 'string'
      },

      product_price: {
          type: 'float'
      },

      product_weight: {
          type: 'float'
      },

      product_image: {
          type: 'string'
      },

      product_thumb: {
          type: 'string'
      },

      product_category: {
          type: 'string'
      },
  }
};

