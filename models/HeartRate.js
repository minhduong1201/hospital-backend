const mongoose=require("mongoose");

const heartRateSchema=new mongoose.Schema(
  {
    value:{type:Number,required:true},
    userId: {type: String, required: true}
  },
  {timestamps:true}
);
module.exports=mongoose.model("HeartRate",heartRateSchema);