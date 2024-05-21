const jwt = require("jsonwebtoken")
require('dotenv').config();

// function verify(req, res, next) {

//     const authHeader = req.headers.token; 

//     if (authHeader) { 
//         const token = authHeader.split(" ")[1];
        
//         jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//             if (err) {
//                 res.status(403).json("JWT token is invalid!");
//                 return;
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         return res.status(401).json("You are not authenticated with a valid JSON web token.");
//     }
// }

function verify(req, res, next) {
    const token = req.headers.token;
  
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY); // Corrected to token.split(" ")[1]
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  

module.exports = verify;