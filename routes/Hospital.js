const router=require("express").Router();
const {verifyToken,verifyTokenandAuthorization, verifyTokenandAdmin}=require("./verifyToken");
const Hospital=require("../models/Hospital")

//POST
router.post("/",verifyToken,async(req,res)=>{
    const exist = await Hospital.findOne({name: req.body.name});
    if (exist) return res.status(500).json("Đã tồn tại bệnh viện này!")
    const newHospital=new Hospital(req.body)
   
    try{
        const saved= await newHospital.save();
        console.log(saved);
        res.status(200).json(saved);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
   })
   
//UPDATE
router.put("/:id",verifyTokenandAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser=await Hospital.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedUser);
    } catch(err){
      res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id",verifyTokenandAuthorization,async(req,res)=>{
    try{
        await Hospital.findByIdAndDelete(req.params.id);
        res.status(200).json("Nguoi dung da bi xoa");
    }catch(err){
        res.status(500).json(err )
    }
});

//GET Hospital by id
router.get("/:id",async(req,res)=>{
    try{
        const user=await Hospital.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err );
    }
});

//GET Hospital by name
router.get("/name/:name",async(req,res)=>{
    try{
        const hospital=await Hospital.findOne({name: req.params.name});
        res.status(200).json(hospital);
    }catch(err){
        res.status(500).json(err );
    }
});

//GET ALL Hospital
router.get("/",verifyTokenandAdmin,async(req,res)=>{
    const query=req.query.new
    try{
        const hospitals=query
        ?await Hospital.find().sort({_id:-1}).limit(5)
        : await Hospital.find();
        res.status(200).json(hospitals);
    }catch(err){
        res.status(500).json(err );
    }
});

module.exports=router