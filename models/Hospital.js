const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    infor: { type: String }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Hospital", HospitalSchema);
