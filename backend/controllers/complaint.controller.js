const Complaint = require('../models/complaint.model');

async function addComplaint(req, res) {
    const { complaintName, complaintContent } = req.body;
    const createdBy = req.user.id;
    try {
        let nextComplaintId;

        // Find the last complaint document created by the user
        //const documents = await Complaint.find({ createdBy: req.user.id }).sort({ complaintId: -1 }).limit(1);
        const documents = await Complaint.find().sort({ complaintId: -1 }).limit(1);
        
        // If no documents found, set the next complaintId to 1
        if (documents.length === 0) {
            nextComplaintId = 1;
        } else {
            // Access the complaintId field of the first document in the array if documents are found
            nextComplaintId = parseInt(documents[0].complaintId) + 1;
        }

        // Create a new complaint with the calculated nextComplaintId
        const complaint = new Complaint({ complaintId: nextComplaintId, complaintName, complaintContent, createdBy });
        await complaint.save();
        res.status(201).json({ msg: 'Complaint added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}



async function updateComplaint(req, res) {
    const { status } = req.body;
  const  id  = req.params.id;

  try {
    const complaint = await Complaint.findOne({complaintId:id});
    
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
  try {
      const { Id } = req.params; // Accessing the complaint ID from route parameters
      const complaints = await Complaint.find({ complaintId :Id}); // Find the complaint by its complaintId
      if (!complaints) {
          return res.status(404).json("Complaint not found");
      }

      // Check if the user is either an admin or the creator of the complaint
      if (req.user.role === "admin" || complaints.createdBy.equals(req.user.id)) {
          // Delete the complaint
          //await Complaint.findOneAndDelete({ complaintId:Id });
          const result = await Complaint.findOneAndDelete(complaints._id);

          // Fetch all complaints after deletion
          const complaintdetails = await Complaint.find({});
          return res.status(200).json(result);
      } else {
          return res.status(403).json("You are not authorized to delete this complaint");
      }
  } catch (err) {
      return res.status(500).json(err);
  }
}
module.exports = { addComplaint, updateComplaint, listComplaintsByUser, deleteComplaint}