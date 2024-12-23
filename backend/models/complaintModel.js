const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true },
  complaintName: { type: String, required: true },
  complaintContent: { type: String, required: true },
  createdBy: { type: String, required: true },
  priority: { type: String, default: 'Medium' },
  category: { type: String, default: 'Technical' },
  attachments: { type: Array, default: [] },
  comments: { type: String, default: 'comments' },
  createdOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['Closed', 'Pending', 'Resolved'], default: 'Pending' },
  lastUpdated: { type: Date, default: Date.now },
  assignedTo: { type: String, default: 'employee?' },
  resolutionTime: { type: String }, // New field to store resolution time
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
