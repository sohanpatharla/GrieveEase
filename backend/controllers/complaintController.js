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
    await complaint.save().then(()=>{
      console.log("Saved");
    });
    res.status(201).json({ msg: 'Complaint added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function updateComplaint(req, res) {
  const { status, comments } = req.body;
  try {
    const complaint = await Complaint.findOne({ createdBy: req.user.id });
    if (!complaint) {
      return res.status(404).json({ msg: 'No Complaints by user' });
    }

    complaint.status = status;
    complaint.comments = comments;
    complaint.lastUpdated = new Date();
    await complaint.save();

    res.json({ msg: 'Status updated successfully' });
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

async function deleteComplaint(req, res) {
  try {
    const complaint = await Complaint.findOne({ createdBy: req.user.id });
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

module.exports = { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint };
