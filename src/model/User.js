const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );
const bcrypt = require( 'bcrypt' ),
    SALT_WORK_FACTOR = 10;

class User {
     
     initSchema () {
          const schema = new Schema({

          'name':{
               type: String,
               required: true,
               min: 6,
               max: 255
          },
          'email':{
               type: String,
               required: true,
               min: 6,
               max: 255,
               unique : true,
          },
          'password': {
               type: String,
               required: true,
               min: 6,
               max: 1024
          },
          'tenant_id': {
               type: mongoose.Schema.Types.ObjectId,
               required: true, 
               ref: 'tenant'
          },
          'date':{
               type: Date,
               default: Date.now
          }
     });


     // Pre save Hook
     schema.pre( 'save', function( next ) {
          const user = this;
          // only hash the password if it has been modified (or is new)

          if ( this.isModified( 'password' ) || this.isNew ) {
          bcrypt.genSalt( SALT_WORK_FACTOR, ( err, salt ) => {
               if ( err ) {
                    return next( err );
               }
               bcrypt.hash( user.password, salt, ( hashErr, hash ) => {
                    if ( hashErr ) {
                         return next( hashErr );
                    }
                    // override the cleartext password with the hashed one
                    user.password = hash;
                    next();
               } );
          } );
          } else {
          return next();
          }
     });

     // Compare Password
     schema.methods.comparePassword = async function( candidatePassword ) {
          return new Promise( ( resolve, reject ) => {
              bcrypt.compare( candidatePassword, this.password, ( err, isMatch ) => {
                  if ( err ) {
                      reject( err );
                  } else {
                      resolve( isMatch );
                  }
              } );
          } );
      };
      schema.statics.findByEmail = function( email ) {
          return this.findOne( { 'email': email } );
      };

     schema.plugin( uniqueValidator );

     try {
          mongoose.model( 'user', schema );
     } catch ( e ) {

     }

}

getInstance() {
     this.initSchema();
     return mongoose.model('user');
 }

}

module.exports = { User };

// module.exports = mongoose.model('User', userSchema,'users');