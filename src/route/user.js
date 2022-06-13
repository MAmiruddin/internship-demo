'use strict';
const AUthController = require( '../controllers/AuthController' );
const UserController = require( '../controllers/UserController' );
const express = require( 'express' ),
    router = express.Router();

    router.get( '/', AUthController.checkLogin, UserController.getAll );
    router.get( '/list', AUthController.checkLogin, UserController.getEmployeeTenent);
    router.get( '/:id', AUthController.checkLogin, UserController.get );
    router.post( '/', AUthController.checkLogin, UserController.insert );
    router.put( '/:id', AUthController.checkLogin, UserController.update );
    router.delete( '/:id', AUthController.checkLogin, UserController.delete );
    


module.exports = router;
