const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    hospitalId: {type: String, required: true},
    customerId: {type: String, required: true},
    sender: {type: String, required: true}, // check xem ai là người gửi, hospital hay customer
    message: {type: String}
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", Message);
