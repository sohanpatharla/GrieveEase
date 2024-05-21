const userModel = require('../models/complaint.model');

async function addComplaint(req, res) {
    const { complaintId, complaintName, complaintContent } = req.body;
    const createdBy = req.user._id;
    try {
        const complaint = new Complaint({ complaintId, complaintName, complaintContent, createdBy });
        await complaint.save()
        res.status(201).json({ msg: 'Complaint added successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

async function updateComplaint(req, res) {
    const { status } = req.body;
  const { id } = req.params;

  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ msg: 'Status updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

async function listComplaintsByUser(req,res) {
    try {
        const complaints = await Complaint.find({ createdBy: req.user._id });
        res.json(complaints);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
};

async function deleteComplaint(req, res) {
  try {
      const complaint = await Complaint.findById(req.body.complaintId); // Find the complaint by its ID
      if (!complaint) {
          return res.status(404).json("Complaint not found");
      }

      // Check if the user is either an admin or the creator of the complaint
      if (req.user.role === "admin" || complaint.createdBy.equals(req.user._id)) {
          const deletedComplaint = await Complaint.findByIdAndDelete(req.body.complaintId);
          console.log(deletedComplaint);
          const complaints = await Complaint.find({}); // Fetch all complaints
          return res.status(200).json(complaints);
      } else {
          return res.status(403).json("You are not authorized to delete this complaint");
      }
  } catch (err) {
      return res.status(500).json(err);
  }
}

module.exports = { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint}