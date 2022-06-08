'use strict';
const { Service } = require( '../../system/services/Service' );

class UserService extends Service {
    constructor( model ) {
        super( model );
        this.model = model;
        this.updatePassword = this.updatePassword.bind(this);
        this.findByEmail = this.findByEmail.bind(this);
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
}

module.exports = { UserService };
