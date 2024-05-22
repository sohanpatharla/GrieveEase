const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  
  complaintId: { type: String, required: true, unique: true },
  complaintName: { type: String, required: true },
  complaintContent: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
});

module.exports = mongoose.model('Complaint', Schema);