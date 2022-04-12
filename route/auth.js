const router = require('express').Router();
const req = require('express/lib/request');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.post('/register', async (req,res) => {

     //Validate Data
     const {error} = registerValidation(req.body);
     if(error)
     return res.status(400).send(error.details[0].message);

     //Check if user is registered
     const emailExists = await User.findOne({email: req.body.email});
     if (emailExists) return res.status(400).send('Email already exists');
     
     //Hash Passwords
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);

     //New User
     const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
     })

     try{
          const savedUser = await user.save();
          res.send({user: user._id});

     }catch(err){
          res.status(400).send(err);
     }
});

//Login
router.post('/login', async (req,res) => {

     //Validate Data
     const {error} = loginValidation(req.body);
     if(error)
     return res.status(400).send(error.details[0].message);

     //Check if email exists
     const user = await User.findOne({email: req.body.email});
     if (!user) return res.status(400).send('Email is not found');
     
     //Check if Password is correct
     const validPass = await bcrypt.compare(req.body.password, user.password);
     if(!validPass) return res.status(400).send('Invalid Password')

     //Create and assign a token
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
     res.header('auth-token', token).send(token);

});

module.exports = router;