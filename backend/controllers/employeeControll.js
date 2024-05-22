const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel")

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

module.exports = { loginEmployee, employeeDetails };
