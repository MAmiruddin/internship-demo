'use strict';
const { UserService } = require( './UserService' );
const { HttpResponse } = require( '../../system/helpers/HttpResponse' );
const mongoose = require( 'mongoose' );
const jwt = require('jsonwebtoken');

class AuthService {
    constructor( model, userModel ) {
        this.model = model;
        this.userService = new UserService( userModel );
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logout = this.logout.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }

    /**
     *
     * @param email: String
     * @param password: String
     * @returns {Promise<any>}
     */
    async login( email, password, res ) {
        const user = await this.userService.findByEmail( email, true );

        if ( !user ) {
            // User not found
            const error = new Error( 'Invalid Email' );

            error.statusCode = 422;
            throw error;
        } else {
            // Process Login
            try {
                // Check Password
                const passwordMatched = await user.comparePassword( password );

                if ( !passwordMatched ) {
                    const error = new Error( 'Invalid Password' );

                    error.statusCode = 422;
                    throw error;
                }

                // Create Token
                const token = await this.model.generateToken(user);

                return token;

                //Using HttpResponse function (Error in sending token because it sends an object)
                //return new HttpResponse( token );
            } catch ( e ) {
                throw e;
            }

        }
    }

    async genRefToken(email,password) {
        const user = await this.userService.findByEmail( email, true );

        if ( !user ) {
            // User not found
            const error = new Error( 'Invalid Email' );

            error.statusCode = 422;
            throw error;
        } else {
            // Process Login
            try {
                // Check Password
                const passwordMatched = await user.comparePassword( password );

                if ( !passwordMatched ) {
                    const error = new Error( 'Invalid Password' );

                    error.statusCode = 422;
                    throw error;
                }

                // Create Token
                const refToken = await this.model.generateRefToken( user );


                return refToken;

                //Same problems as in Login
                //return new HttpResponse( refToken );
            } catch ( e ) {
                throw e;
            }

        }
    }

    async register( data ) {
        try {
            return await this.userService.insert( data );
        } catch ( error ) {
            throw error;
        }
    }

    async changePassword( id, data ) {
        try {
            const updatedPassword = await this.userService.updatePassword( id, data );

            return new HttpResponse( updatedPassword );
        } catch ( error ) {
            throw error;
        }
    }

    async logout() {
        try {
            return new HttpResponse( { 'logout': true } );
        } catch ( error ) {
            throw error;
        }
    }

    async checkLogin( token, res ) {
        if(!token) return res.status(401).send('Access Denied!');
        try{   
            // Check the token is a valid JWT
            const user = await this.model.decodeToken( token );

            if ( !user ) {
                const error = new Error( 'Invalid Token' );

                error.statusCode = 401;
                throw error;
            }
            
        } catch ( e ) {
            const error = new Error( 'Expired Token! Please generate a new token or log in again.' );

            error.statusCode = 401;
            throw error;
        }
    }

}

module.exports = { AuthService };
