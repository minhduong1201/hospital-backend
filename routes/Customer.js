const router=require("express").Router();
const {verifyToken,verifyTokenandAuthorization, verifyTokenandAdmin}=require("./verifyToken");
const Customer=require("../models/Customer");

// GET CUSTOMER IN HOSPITAL
router.get("/:id", verifyToken,async(req,res)=>{
    const id = req.params.id;
    try{
      const customers = await Customer.find({ hospitalId: id });
      res.status(200).json(customers);
    }catch(err){
        res.status(500).json(err );
    }
  });

  //GET CUSTOMER current
router.get("/user/:id", verifyToken,async(req,res)=>{
    const id = req.params.id;
    try{
      const customers = await Customer.find({ _id: id });
      res.status(200).json(customers);
    }catch(err){
        res.status(500).json(err );
    }
  });

//Create
router.post("/",verifyToken,async(req,res)=>{
 const newCustomer=new Customer(req.body)

 try{
     const saved=await newCustomer.save();
     res.status(200).json(saved);
 }catch(err){
     res.status(500).json(err);
 }
})




//UPDATE
router.put("/:id",async (req,res)=>{
    try{
        const updateCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updateCustomer);
    } catch(err){
      res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id",verifyToken,async(req,res)=>{
    try{
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("Đã xóa bệnh nhân");
    }catch(err){
        res.status(500).json("Xóa thất bại" )
    }
});

//GET User Heart rate
router.get("/find/:userId", verifyTokenandAuthorization,async(req,res)=>{
    try{
        const cart=await Customer.findOne({userId:req.params.userId}); 
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err );
    }
});

//GET ALL Customer
router.get("/",verifyTokenandAdmin,async(req,res)=>{
    try{
        const carts=await Customer.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err );
    }
});


module.exports=router