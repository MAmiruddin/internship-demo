
const { Controller } = require( '../../system/controller/Controller' );
const { UserService } = require( '../services/UserService' );
const { User } = require( '../model/User' );
    
const userService = new UserService(new User().getInstance());

class UserController extends Controller {

    constructor( service ) {
        super( service );
        // To add new methods don't forget to bind the methods!
        // Example in the AuthController constructor.
    }

    async getEmployeeTenent (req, res, next){
        try {
            
            const result = await userService.findEmployeeTenents().then(function(result) {
            return new Promise(function(resolve, reject) {
                resolve(result);
            })
          });
          
            await res.status(201).json(result);

        } catch ( e ) {
            next( e );
        }
    }

}

module.exports = new UserController( userService );
