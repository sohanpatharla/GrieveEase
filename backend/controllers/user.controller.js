const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usres.model");

async function registerUser(req, res) {
  const { email, password, username, name, mobileNumber, isAdmin } = req.body;
  const Model = req.model;

  try {
    let user = await Model.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new Model({ email, password, username, name, mobileNumber, isAdmin });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const Model = req.model;

  try {
    let user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function userDetails(req, res) {
  try {
      const details = await req.model.findById(req.user.id);
      
      if (details) {
          const { password, ...info } = details._doc;
          return res.status(200).json(info);
      } else {
          return res.status(404).json({ message: 'User not found' });
      }
  } catch (err) {
      return res.status(500).json(err);
  }
}


module.exports = { registerUser, loginUser, userDetails };
