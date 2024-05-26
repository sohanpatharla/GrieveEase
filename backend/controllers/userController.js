const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function loginUser(req, res) {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    else{
      console.log("User found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.role !== role) {
      console.log(user.role);
      console.log(role);
      console.log("Unauthorized access");
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name:user.username
      }
      ,
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
async function registerUser(req, res) {
  const { email, password, username, name, mobileNumber, role } = req.body;
  
  console.log('Request body:', req.body);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    user = new User({ email, password, username, name, mobileNumber, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}


//module.exports = { registerUser,loginUser };
  
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// async function registerUser(req, res) {
//   const { email, password, username,name, mobileNumber, role } = req.body;

//   try {
//     let user = await User.findOne({ username });
//     if (user) {
//       return res.status(400).json({ msg: "Username not available" });
//     }

//     user = new User({ email, password, username, name,mobileNumber, role });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// }

// async function loginUser(req, res) {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.SECRET_KEY,
//       { expiresIn: "1h" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// }

async function userDetails(req, res) {
    try {
        //console.log(req.params.id)
        const details = await User.find({})
        await res.status(200).json(details);
        // if (details) {
        //     const { password, ...info } = details._doc;
        //     await res.status(200).json(info);
        // }
        // else {
        //     res.json({ message: `No User wuth id ${id}` })
        // }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = { registerUser, loginUser, userDetails };
