const mongoose = require('mongoose');


const tenantSchema = new mongoose.Schema({

     tenant_name:{
          type: String,
          required: true,
     },

});

module.exports = mongoose.model('Tenant', tenantSchema, 'tenant');