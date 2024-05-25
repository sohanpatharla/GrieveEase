const Complaint = require('../models/complaintModel');

async function addComplaint(req, res) {
  console.log("Working");
  console.log(req.user);
  const { complaintId, complaintName, complaintContent, priority, category, attachments, comments } = req.body;
  const createdBy = req.user.id;
  console.log(req.body);
  try {
    const complaint = new Complaint({
      complaintId,
      complaintName,
      complaintContent,
      createdBy,
      priority,
      category,
      attachments,
      comments
    });
    await complaint.save().then(() => {
      console.log("Saved");
    });
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function updateComplaint(req, res) {
  const { id } = req.params; // Extract the id from req.params
  const { complaintName, complaintContent, priority, category, attachments, comments, status, assignedTo } = req.body; // Extract the updated fields from req.body

  try {
    // Find the complaint by id and createdBy user
    const complaint = await Complaint.findOne({ _id: id, createdBy: req.user.id });
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Update the complaint fields
    if (complaintName) complaint.complaintName = complaintName;
    if (complaintContent) complaint.complaintContent = complaintContent;
    if (priority) complaint.priority = priority;
    if (category) complaint.category = category;
    if (attachments) complaint.attachments = attachments;
    if (comments) complaint.comments = comments;
    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
    complaint.lastUpdated = new Date();

    await complaint.save();

    res.json({ msg: 'Complaint updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function listComplaintsByUser(req, res) {
  try {
    const complaints = await Complaint.find({ createdBy: req.user.id });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function listComplaintById(req, res) {
  console.log(req.params.id);
  try {
    const complaints = await Complaint.findOne({ complaintId: req.params.id });
    console.log(complaints);
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function deleteComplaint(req, res) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) {
      return res.status(404).json("No complaints by the user");
    }

    await Complaint.findOneAndDelete({ _id: complaint._id });
    const complaints = await Complaint.find({});
    return res.status(200).json(complaints);
  } catch (err) {
    return res.status(500).json(err);
  }
}

module.exports = { addComplaint, updateComplaint, listComplaintsByUser, listComplaintById, deleteComplaint };
