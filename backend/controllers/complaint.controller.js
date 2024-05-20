const userModel = require('../models/complaint.model');

async function addComplaint(req, res) {
    const { complaintId, complaintName, complaintContent, createdBy } = req.body;
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
        const complaints = await Complaint.find({ createdBy: req.user.id });
        res.json(complaints);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
};

async function deleteComplaint(req, res) {
    if (req.user.id === req.body.id || req.user.isAdmin) {
        try {
            const deleteUser = await userModel.findByIdAndDelete(req.body.id)
            console.log(deleteUser)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can only delete complaints on your account!");
    }
    const user = await userModel.find({})
    res.status(200).json(user);
}

module.exports = { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint}