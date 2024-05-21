const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/schema.model");

async function registerUser(req, res) {
  const { email, password, username,name, mobileNumber, role } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Username not available" });
    }

    user = new User({ email, password, username, name,mobileNumber, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
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

async function userDetails(req, res) {
    try {
        //const { id } = req.params.id
        const user = await User.findById(req.body.id)
        if (user) {
            const { password, ...info } = user._doc;
            res.status(200).json(info);
        }
        else {
            res.json({ message: `No User wuth id ${id}` })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = { registerUser, loginUser, userDetails };
