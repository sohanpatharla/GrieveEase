const mongoose = require("mongoose");

const emplyeeSchema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    employeeName:{type:String,required:true},
    username:{type:String,required:true},
    password: { type: String, required: true },
    mobileNumber: { type: String },
   
    role: {
      type: String,
      default: "Employee"
    },
    addedBy:{type:mongoose.Schema.Types.ObjectId,ref:"Admin",required:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
