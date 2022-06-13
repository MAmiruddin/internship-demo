'use strict';
const AUthController = require( '../controllers/AuthController' );
const TenantController = require( '../controllers/TenantController' );
const express = require( 'express' ),
    router = express.Router();

    router.get( '/getAll', AUthController.checkLogin, TenantController.getAll );
    router.get( '/:id', TenantController.get );
    router.post( '/', TenantController.insert );
    router.put( '/:id', TenantController.update );
    router.delete( '/:id', TenantController.delete );
    


module.exports = router;
