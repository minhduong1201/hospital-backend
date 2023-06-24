const router=require("express").Router();
const {verifyToken,verifyTokenandAuthorization, verifyTokenandAdmin}=require("./verifyToken");
const Employee=require("../models/Employee");


//GET Employee in hospital
router.get("/:id", verifyToken,async(req,res)=>{
  const id = req.params.id;
  try{
    const employees = await Employee.find({ hospitalId: id });
    res.status(200).json(employees);
  }catch(err){
      res.status(500).json(err );
  }
});

//GET Employee current
router.get("/user/:id", verifyToken,async(req,res)=>{
  const id = req.params.id;
  try{
    const employees = await Employee.find({ _id: id });
    res.status(200).json(employees);
  }catch(err){
      res.status(500).json(err );
  }
});

//UPDATE
router.put("/:id", verifyToken,async (req,res)=>{
    try{
        const updatedOrder=await Employee.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedOrder);
    } catch(err){
      res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id",verifyTokenandAdmin,async(req,res)=>{
    try{
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json("Đơn hàng đã bị xóa");
    }catch(err){
        res.status(500).json(err )
    }
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenandAdmin, async (req, res) => {
  const productId=req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Employee.aggregate([
        { $match: { createdAt: { $gte: previousMonth },...(productId&&{
          products:{$elemMatch:{productId}},
        }),
      },
     },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports=router