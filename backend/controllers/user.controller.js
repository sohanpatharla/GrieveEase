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

      // Store user information in the session upon successful login
      req.session.user = {
          id: user._id,
          email: user.email,
          role: user.role
          // Add any other user information you want to store in the session
      };

      res.status(200).json({ msg: "User logged in successfully" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
  }
}

async function userDetails(req, res) {
    try {
        //console.log(req.params.id)
        const details = await User.findById(req.session.user.id)
        if (details) {
            const { password, ...info } = details._doc;
            await res.status(200).json(info);
        }
        // else {
        //     res.json({ message: `No User wuth id ${id}` })
        // }
    } catch (err) {
        res.status(500).json(err)
    }
}

async function logoutUser(req,res)
{
  delete req.session.user; 
   /* req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
            return;
        }*/
        if(!req.session.user)
           res.send("Logout successful")
       res.redirect(`http://localhost:${port}/api/users/login`); // Redirect the user to the login page after logout
    
}


module.exports = { registerUser, loginUser, userDetails ,logoutUser};
