'use strict';
const AUthController = require( '../controllers/AuthController' );
const express = require( 'express' ),
    router = express.Router();

router.get('/', AUthController.redirect)
router.post( '/login', AUthController.login );
router.post( '/token', AUthController.newToken );
router.get( '/logout', AUthController.checkLogin, AUthController.logout );
router.post( '/register', AUthController.register );
router.get( '/getData', AUthController.checkLogin, AUthController.getData );


//WIP
//router.post( '/changePassword', AUthController.checkLogin, AUthController.changePassword );


module.exports = router;
