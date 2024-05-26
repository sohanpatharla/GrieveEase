const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel")
const Complaint = require("../models/complaintModel");

async function loginEmployee(req, res) {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      employee: {
        id: employee.id,
        role: employee.role,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function employeeDetails(req, res) {
    try {
        //console.log(req.params.id)
        const details = await Employee.findById(req.employee.id)
        if (details) {
            const { password, ...info } = details._doc;
            await res.status(200).json(info);
        }
        // else {
        //     res.json({ message: `No Employee wuth id ${id}` })
        // }
    } catch (err) {
        res.status(500).json(err)
    }
}



async function assignedComplaints(req, res) {
  try {
    console.log(req.user.name);
    const employeeName = req.user.name; // Extract the employee ID from the token
    const complaints = await Complaint.find({ assignedTo: employeeName });
    console.log(complaints);
    res.status(200).json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}
async function updateComplaint(req, res) {
  const { complaintId } = req.params;
  const { comments, status } = req.body;

  try {
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintId },
      {
        comments,
        status,
        lastUpdated: Date.now(),
      },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = { loginEmployee, employeeDetails,assignedComplaints,updateComplaint };
