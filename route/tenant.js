const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const Tenant = require('../model/Tenant');
const User = require('../model/User');

router.post('/', async (req,res) => {

     //New Tenant
     const tenant = new Tenant({
          tenant_name: req.body.tenant_name
     })

     try{
          const savedTenant = await tenant.save();
          res.send({tenant_id: tenant._id});

     }catch(err){
          res.status(400).send(err);
     }
});

//Find Tenant
router.get('/list', async (req,res) => {

     try{
          const get = await Tenant.find();
          res.json(get);
     }catch(err){
          res.json({message:err});
     }
     

});

//Find Tenant By ID
router.get('/:getId', async (req,res) => {

     try{
          const gets = await Tenant.findOne({tenant_id: req.params.getId});
          res.json(gets);
     }catch(err){
          res.json({message:err});
     }

});

//Find Employee in Tenants
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
                 from:"tenant",
                 localField: "tenant_id",
                 foreignField: "_id",
                 as: "Tenant"
          }
       },
     {
            $unwind : { path: '$tenant', "preserveNullAndEmptyArrays": true }
     },
  ])

res.json(result);
  

});

module.exports = router;