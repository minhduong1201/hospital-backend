const mongoose=require("mongoose");

const CustomerSchema=new mongoose.Schema(
    {
    name: {type: String, required: true},
    username:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    phone: {type: String},
    address: {type: String},
    age: {type: Number},
    hospitalId: {type: String},
    img:{type: String},
    health:{type: String}
},
  {timestamps:true}
);
module.exports=mongoose.model("Customer",CustomerSchema);