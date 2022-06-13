'use strict';
const { Service } = require( '../../system/services/Service' );
//const { default: mongoose } = require('mongoose');

class TenantService extends Service {
    constructor( model ) {
        super( model );
    }
}

module.exports = { TenantService };
