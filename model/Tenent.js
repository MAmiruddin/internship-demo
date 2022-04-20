const mongoose = require('mongoose');


const tenentSchema = new mongoose.Schema({

     tenent_name:{
          type: String,
          required: true,
     },

});

module.exports = mongoose.model('Tenent', tenentSchema, 'tenent');