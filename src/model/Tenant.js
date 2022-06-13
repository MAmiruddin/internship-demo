const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class Tenant {
     initSchema() {
          
          const schema = new Schema({
               'tenant_name': {
                   'type': String,
                   'required': true,
               }
           }, { 'timestamps': true });

          schema.plugin( uniqueValidator );
          
          try {
               mongoose.model( 'tenant', schema );
          } catch ( e ) {
     
          }
     }

     getInstance() {
          this.initSchema();
          return mongoose.model( 'tenant' );
     }
     
}


module.exports = { Tenant };
//module.exports = mongoose.model('Tenant', tenantSchema, 'tenant');