const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: {type:String,required:true},
    mobileNumber: { type: String },
    role: { type: String, enum: ['employee', 'admin', 'user'], default: "user"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
