const router = require('express').Router();
const req = require('express/lib/request');
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Create User
router.post('/register', async (req,res) => {

     //Validate Data
     /*const {error} = registerValidation(req.body);
     if(error)
     return res.status(400).send(error.details[0].message);*/

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
          password: hashedPassword,
          tenent_id: req.body.tenent_id
     })

     try{
          const savedUser = await user.save();
          res.send(savedUser);

     }catch(err){
          res.status(400).send(err);
     }
});

//Find User
router.get('/', async (req,res) => {

     try{
          const get = await User.find();
          res.json(get);
     }catch(err){
          res.json({message:err});
     }
     

});

//Find User By ID
router.get('/:getId', async (req,res) => {

     try{
          const gets = await User.findById(req.params.getId);
          res.json(gets);
     }catch(err){
          res.json({message:err});
     }

});

//Delete User
router.delete('/:deleteId', async (req,res) => {

     try{
          const removed = await User.remove({_id: req.params.deleteId});
          res.json(removed);
     }catch(err){
          res.json({message:err});
     }

});

//Update User Info
router.put('/:putId', async (req,res) => {

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

     try{

          const updated = await User.updateOne(

               {_id: req.params.putId}, 
               {$set:
                    {
                         name: req.body.name,
                         email: req.body.email,
                         password: hashedPassword
                    }
               });

          res.json(updated);
     }catch(err){
          res.json({message:err});
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
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn:'15s'});

     //Create refresh token
     const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_SECRET);

     res.json({acessToken: token, refreshToken: refreshToken})


});

//Request a new token
router.post('/token', async (req,res) => {

     const refToken = req.body.token;
     jwt.verify(refToken, process.env.REFRESH_SECRET, (err,user) => {
          if (err) return res.status(400).send('Access Denied');
          const accessToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn:'15s'});
          res.json({newToken: accessToken})
     })

});

module.exports = router;