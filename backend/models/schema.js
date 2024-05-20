const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true, default: false },
    role: { type: String, required: true }
},
    { timestamps: true }
);

module.exports = mongoose.model("schema", schema);