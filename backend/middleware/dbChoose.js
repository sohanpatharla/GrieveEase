const mongoose = require('mongoose');
const User = require('../models/usres.model')

const dbChoose = (req, res, next) => {
    const isAdmin = req.body.isAdmin;
  req.model = isAdmin ? mongoose.model('Admin', User.schema) : mongoose.model('User', User.schema);
  next();
  };

module.exports = dbChoose;