const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Tenent = require('../model/Tenent');
const User = require('../model/User');

router.post('/', async (req,res) => {

     //New Tenent
     const tenent = new Tenent({
          tenent_name: req.body.tenent_name
     })

     try{
          const savedTenent = await tenent.save();
          res.send({tenent_id: tenent._id});

     }catch(err){
          res.status(400).send(err);
     }
});

//Find Tenent
router.get('/list', async (req,res) => {

     try{
          const get = await Tenent.find();
          res.json(get);
     }catch(err){
          res.json({message:err});
     }
     

});

//Find Tenent By ID
router.get('/:getId', async (req,res) => {

     try{
          const gets = await Tenent.findOne({tenent_id: req.params.getId});
          res.json(gets);
     }catch(err){
          res.json({message:err});
     }

});

//Find Employee in Tenents
router.get('/', async (req,res) => {

const result =  await mongoose.model('User').aggregate([
     
     {
          $addFields: { 
               tenantId: { 
                    $toObjectId: 
                    "$tenant_id" 
               } 
          } 
     },
     {
          $lookup:{
                 from:"tenent",
                 localField: "tenent_id",
                 foreignField: "_id",
                 as: "Tenent"
          }
       },
     {
            $unwind : { path: '$tenant', "preserveNullAndEmptyArrays": true }
     },
  ])

res.json(result);
  

});

module.exports = router;