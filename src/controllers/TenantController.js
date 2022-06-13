
const { Controller } = require( '../../system/controller/Controller' );
const { TenantService } = require( '../services/TenentService');
const { Tenant } = require( '../model/Tenant' );
    
const tenantService = new TenantService(new Tenant().getInstance());

class TenantController extends Controller {

    constructor( service ) {
        super( service );
        // To add new methods don't forget to bind the methods!
        // Example in the AuthController constructor.
    }

    /*async getEmployeeTenent (req, res, next){
        try {

            const result = userService.findEmployeeTenents();
            await res.status(201).json(result);

        } catch ( e ) {
            next( e );
        }
    }*/

}

module.exports = new TenantController( tenantService );
