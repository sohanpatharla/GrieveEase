const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true },
  complaintName: { type: String, required: true },
  complaintContent: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, default: 'Medium' },
  category: { type: String, default: 'Technical' },
  attachments: { type: Array, default: [] },
  comments: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  lastUpdated: { type: Date, default: Date.now },
  assignedTo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
