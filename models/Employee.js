const mongoose=require("mongoose");

const EmployeeSchema=new mongoose.Schema(
    {
      name: {type: String, required: true},
      username:{type:String,required:true, unique:true},
      password:{type:String,required:true},
      phone: {type: String, required: true, unique: true},
      role: {type: String, required: true},
      age: {type: String},
      address: {type: String},
      email: {type: String},
      hospitalId: {type: String},
      img:{type:String},
},
  {timestamps:true}
);
module.exports=mongoose.model("Employee",EmployeeSchema);