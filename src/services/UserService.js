'use strict';
const { Service } = require( '../../system/services/Service' );
const { default: mongoose } = require('mongoose');

class UserService extends Service {
    constructor( model ) {
        super( model );
        this.model = model;
        this.updatePassword = this.updatePassword.bind(this);
        this.findByEmail = this.findByEmail.bind(this);
        this.findEmployeeTenents = this.findEmployeeTenents.bind(this);
    }

    async updatePassword( id, data ) {
        try {
            await this.model.findByIdAndUpdate( id, data, { 'new': true } );
            return { 'passwordChanged': true };
        } catch ( errors ) {
            throw errors;
        }
    }

    /**
     *
     * @param email : string
     * @param includePassword : boolean
     * @returns {Promise<*>}
     */
    async findByEmail( email, includePassword = false ) {
        return includePassword ? this.model.findByEmail( email ).select( '+password' ) : this.model.findByEmail( email );
    }

    async findEmployeeTenents (){

        const result =  await mongoose.model('user', this.model.schema).aggregate([
          
            {
                 $addFields: { 
                      tenantId: { 
                           $toObjectId: 
                           "$tenant_id" 
                      } 
                 } 
            },
            {
                 $lookup:{
                        from:"tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "Tenant"
                 }
              },
            {
                   $unwind : { path: '$tenants', "preserveNullAndEmptyArrays": true }
            },
       ]);

        return result;
    }
}

module.exports = { UserService };
