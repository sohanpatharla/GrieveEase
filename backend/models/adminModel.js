const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, unique: true },
    companyId: { tyrp: String, required: true, unique: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    role: {type: String, default: "admin"},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", schema);
