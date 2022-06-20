const { AuthService } = require( '../services/AuthService' );
const { Auth } = require( '../model/Auth' );
const { User } = require( '../model/User' );
const bcrypt = require( 'bcrypt' );
    SALT_WORK_FACTOR = 10;
    
    
const authService = new AuthService(new Auth().getInstance(), new User().getInstance());

class AuthController {

    constructor( service ) {
        this.service = service;
        this.login = this.login.bind(this);
        this.newToken = this.newToken.bind(this)
        this.register = this.register.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logout = this.logout.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }

    async login( req, res, next ) {
        try {
            
            const token = await this.service.login( req.body.email, req.body.password, res );
            await res.set('auth-token', [token]);
            
            await res.status(200).json("Autharized Log in!");

            console.log("User Login");

            // For debugging purposes (Token)
            // console.log(req.header('auth-token'));
            // console.log(token);
            // console.log(req.header('ref-token'));
            // console.log(refToken);

        } catch ( e ) {
            next( e );
        }
    }

    async newToken( req, res, next ) {
        try {
            
            const refToken = req.get('ref-token');

            const newToken = await this.service.genNewToken(refToken);
            await res.set('auth-token', [newToken]);
            
            res.status(200).json("Generated new token!");

            // For debugging purposes (Token)
            // console.log(req.header('auth-token'));
            // console.log(newToken);
            // console.log(req.get('ref-token'));
            // console.log(refToken);

        } catch ( e ) {
            next( e );
        }
    }

    async register( req, res, next ) {
        try {
            const registeredUserData = await this.service.register( req.body );

            await res.status(201).json( registeredUserData );
        } catch ( e ) {
            next( e );
        }
    }

    async redirect( req, res, next ) {
        try {
            res.json ("You have logged in using another device!");
        } catch ( e ) {
            next( e );
        }
    }

    // This function is a WIP
    async changePassword( req, res, next ) {
        try {
            const id = req.user._id;

            bcrypt.genSalt( SALT_WORK_FACTOR, async( err, salt ) => {
                if ( err ) {
                    return next( err );
                }
                bcrypt.hash( req.body.password, salt, async( hashErr, hash ) => {
                    if ( hashErr ) {
                        return next( hashErr );
                    }
                    const data = { 'password': hash },
                        response = await this.service.changePassword( id, data );

                    await res.status( response.statusCode ).json( response );
                } );
            } );
        } catch ( e ) {
            next( e );
        }
    }

    async logout( req, res, next ) {
        try {
            //Destroy Tokens From Header
            await res.set('auth-token', null);
            await res.set('ref-token', null);
            
            const response = await this.service.logout( req.token );

            await res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }

    async checkLogin( req, res, next ) {
        try {
            // For token debungging purposes
            //console.log(req.header('auth-token'));

            const token = req.header('auth-token');
            const email = req.header('user-email');
            const loginStamp = req.header('login-stamp');

            req.user = await this.service.checkLogin( token, email, loginStamp, res );
            req.authorized = true;
            req.token = token;
            console.log("Autherized Log in !");
            next();
        } catch ( e ) {
            next( e );
        }
    }

    async getData( req, res, next ) {
        try {
            const random = require('crypto').randomBytes(32).toString('hex');
            res.json(random)
            console.log(random);
            next();
        } catch ( e ) {
            next( e );
        }
    }

}

module.exports = new AuthController( authService );
