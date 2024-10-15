const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    employeeName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    role: { type: String, default: "employee" },
    addedBy: { type: String, required: true },
    category: { type: String, required: true }, // New field for employee's complaint category
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
