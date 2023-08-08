const router=require("express").Router();
const {verifyToken,verifyTokenandAuthorization, verifyTokenandAdmin}=require("./verifyToken");
const HeartRate=require("../models/HeartRate");

//Create
router.post("/",
// verifyToken,
async(req,res)=>{
    console.log(req.body);
 const newHeartRate=new HeartRate(req.body)
 try{
     const savedHeartRate=await newHeartRate.save();
     res.status(200).json(savedHeartRate);
 }catch(err){
     res.status(500).json(err);
 }
})

// GET LAST HEART_RATE
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const lastHeartRate = await HeartRate.findOne({ userId })
        .sort({ createdAt: -1 })
        .exec();
  
      if (lastHeartRate) {
        res.status(200).json(lastHeartRate);
      } else {
        res.status(200).json(0);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// GET last 10 heart rate values for today
router.get('/today/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Get the start of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Find the last 15 heart rate records for today
      const heartRates = await HeartRate.find({
        userId,
        createdAt: { $gte: today },
      })
        .sort({ createdAt: -1 }) // Sort by descending createdAt to get the latest records
        .limit(10)
        const data = heartRates.reverse();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
//UPDATE
router.put("/:id",verifyTokenandAdmin,async (req,res)=>{
    try{
        const updatedProduct=await HeartRate.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedProduct);
    } catch(err){
      res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id",verifyTokenandAdmin,async (req,res)=>{
    try{
        await HeartRate.findByIdAndDelete(req.params.id);
        res.status(200).json("Sản phẩm đã bị xóa");
    }catch(err){
        res.status(500).json(err )
    }
});

//GET HeartRate
router.get("/find/:id", async (req,res)=>{
    try{
        const product=await HeartRate.findById(req.params.id);
       
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err );
    }
});

//GET ALL Products 
router.get("/",async(req,res)=>{
    const qnew=req.query.new;
    const qCategory=req.query.category;
    try{
        let products;
        if(qnew){
            products=await HeartRate.find().sort({createdAt:-1}).limit(5)
        } else if(qCategory){
            products=await HeartRate.find({categories:{
                $in:[qCategory],
            },

        });
        }else{
           products=await HeartRate.find(); 
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err );
    }
});

/*/GET USER STATS
router.get("/stats",verifyTokenandAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
try{
  const data=await User.aggregate([
      {$match:{createAt:{$gte:lastYear}}},
      {
        $project:{
            month:{$month:"$createdAt"},
        },  
      },
      {
          $group:{
              _id:"$month",
              total:{$sum: 1},
          },
      },
  ]);
  res.status(200).json(data)
}catch(err){
    res.status(500).json(err);
}
});
*/
module.exports=router