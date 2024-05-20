const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: { type: String, required: true },
    complaintId: { type: String, required: true },
    complaint: { type: String, required: true }
},
    { timestamps: true }
); 

module.exports = mongoose.model("complaint", schema);