const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const jwt = require('jsonwebtoken'),
    //jwtKey = process.env.TOKEN_SECRET,
    //jwtRefKey = process.env.REFRESH_SECRET,
    jwtExpirySeconds = '15s';

class Auth {
    initSchema() {
        const schema = new Schema({
            'user': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref': 'user'
            }
        }, { 'timestamps': true });

        // Create and assign a token
        // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn:'15s'});

        // Create refresh token
        // const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_SECRET);

        schema.statics.generateToken = async function (user) {
            // Create a new token with the user details
            try {
                const token = await jwt.sign(
                    {'_id': user._id.toString()}, process.env.TOKEN_SECRET, { expiresIn: '50s' });
                return token;
            } catch (e) {
                throw e;
            }
        };

        schema.statics.decodeToken = async function (token) {
            // Verify the token
            try {
                return await jwt.verify(token, process.env.TOKEN_SECRET);
            } catch (e) {
                throw e;
            }
        };

        try {
            mongoose.model('auth', schema);
        } catch (e) { }
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('auth');
    }
}

module.exports = { Auth };
