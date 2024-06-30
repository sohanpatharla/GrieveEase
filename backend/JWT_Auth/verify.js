const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');

module.exports = async function(req, res, next) {
  console.log(`In verify.js`);
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log("Validating token");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);
    console.log(`decoded token user role`,decoded.user.role);
    if(decoded.user.role === 'user')
      {
        req.user = await User.findById(decoded.user.id).select('-password'); // Assuming the payload has user.id
    console.log("Authenticated user:", req.user);
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
      }
      if(decoded.user.role == 'employee'){
        console.log(`validating employee`);
        req.user = await Employee.findById(decoded.user.id).select('-password'); // Assuming the payload has user.id
      console.log("Authenticated user:", req.user);
      if (!req.user) {
        return res.status(401).json({ msg: 'User not found' });
      }
      }
    
    next();
  } catch (err) {
    console.error("Token validation error:", err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
