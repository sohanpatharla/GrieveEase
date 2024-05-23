const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  complaintName: { type: String, required: true },
  complaintContent: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, enum: ['Technical', 'Administrative', 'Financial'], default: 'Technical' },
  attachments: { type: [String] },
  comments: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  resolutionDate: { type: Date },
  feedback: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Complaint', complaintSchema);
