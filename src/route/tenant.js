'use strict';
const AUthController = require( '../controllers/AuthController' );
const TenantController = require( '../controllers/TenantController' );
const express = require( 'express' ),
    router = express.Router();

    router.get( '/getAll', AUthController.checkLogin, TenantController.getAll );
    router.get( '/:id', AUthController.checkLogin, TenantController.get );
    router.post( '/', AUthController.checkLogin, TenantController.insert );
    router.put( '/:id', AUthController.checkLogin, TenantController.update );
    router.delete( '/:id', AUthController.checkLogin, TenantController.delete );
    


module.exports = router;
