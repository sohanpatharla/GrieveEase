const Complaint = require('../models/complaintModel');

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to classify a complaint and update its category in the database
async function classifyAndUpdateComplaint(complaintId, complaintContent) {
  try {
    // Create a chat session with the AI model
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: `"${complaintContent}"`},
          ],
        },
      ],
    });

    // Get the AI's response, which includes the category
    const response = await chatSession.generate({
      role: "user",
      parts: [{ text: complaintContent }],
    });

    // Extract the category from the AI's response
    const predictedCategory = response.history[response.history.length - 1].parts[0].text.trim();

    // Update the complaint in the database with the predicted category
    await ComplaintModel.findByIdAndUpdate(complaintId, { category: predictedCategory });

    console.log(`Complaint ${complaintId} categorized as ${predictedCategory}`);

  } catch (error) {
    console.error("Error classifying the complaint:", error);
  }
}

  async function addComplaint(req, res) {
    console.log("Working");
    console.log(req.user);
    const { complaintId, complaintName, complaintContent, priority, category, attachments, comments } = req.body;
    const createdBy = req.user.name;
    classifyAndUpdateComplaint(complaintId, complaintContent);
    category=predictedCategory;
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
    console.log(req.user);
    const complaints = await Complaint.find({ createdBy: req.user.name });
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

const getComplaintsOverTime = async (req, res) => {
  try {
    console.log('In complaints section');
      const complaintsOverTime = await Complaint.aggregate([
          {
              $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                  count: { $sum: 1 }
              }
          },
          { $sort: { _id: 1 } }
      ]);
      console.log(complaintsOverTime);
      res.status(200).json(complaintsOverTime);
  } catch (error) {
      console.error('Error fetching complaints over time:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Complaints by Category
const getComplaintsByCategory = async (req, res) => {
  try {
    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.status(200).json(complaintsByCategory);
  } catch (error) {
    console.error('Error fetching complaints by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Average Resolution Time
const getAverageResolutionTime = async (req, res) => {
  try {
    const averageResolutionTime = await Complaint.aggregate([
      { $match: { status: 'Closed' } },
      {
        $project: {
          resolutionTime: { $subtract: ['$lastUpdated', '$createdOn'] },
          category: 1
        }
      },
      {
        $group: {
          _id: '$category',
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ]);
    res.status(200).json(averageResolutionTime);
  } catch (error) {
    console.error('Error fetching average resolution time:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Complaint Priority Distribution
const getComplaintPriorityDistribution = async (req, res) => {
  try {
    const priorityDistribution = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    res.status(200).json(priorityDistribution);
  } catch (error) {
    console.error('Error fetching complaint priority distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Top Complaint Generators
const getTopComplaintGenerators = async (req, res) => {
  try {
    const topGenerators = await Complaint.aggregate([
      { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json(topGenerators);
  } catch (error) {
    console.error('Error fetching top complaint generators:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Complaints by User Type
const getComplaintsByUserType = async (req, res) => {
  try {
    const complaintsByUserType = await Complaint.aggregate([
      {
        $group: {
          _id: '$createdBy', 
          complaints: { 
            $push: {
              complaintId: "$complaintId",
              complaintName: "$complaintName",
              category: "$category",
              priority: "$priority",
              status: "$status",
              createdOn: "$createdOn",
              lastUpdated: "$lastUpdated"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(complaintsByUserType);
  } catch (error) {
    console.error('Error fetching complaints by user type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Monthly/Quarterly Comparison
const getMonthlyQuarterlyComparison = async (req, res) => {
  try {
    const monthlyComparison = await Complaint.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdOn' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);
    res.status(200).json(monthlyComparison);
  } catch (error) {
    console.error('Error fetching monthly/quarterly comparison:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Resolution Rate
const getResolutionRate = async (req, res) => {
  try {
    const resolutionRate = await Complaint.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdOn' } }, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } } } },
      { $project: { _id: 1, resolutionRate: { $divide: ['$resolved', '$total'] } } },
      { $sort: { '_id': 1 } }
    ]);
    res.status(200).json(resolutionRate);
  } catch (error) {
    console.error('Error fetching resolution rate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Complaints by Location
const getComplaintsByLocation = async (req, res) => {
  try {
    const complaintsByLocation = await Complaint.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } }
    ]);
    res.status(200).json(complaintsByLocation);
  } catch (error) {
    console.error('Error fetching complaints by location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const Employee = require("../models/employeeModel");

async function getEmployeeAvgResolutionTime(req, res) {
  try {
    // Aggregate complaints to calculate average resolution time by employee
    const avgResolutionTime = await Complaint.aggregate([
      {
        $match: { status: { $in: ["Resolved", "Closed"] } } // Only resolved or closed complaints
      },
      {
        $group: {
          _id: "$assignedTo",
          avgResolutionTime: {
            $avg: {
              $divide: [
                { $subtract: ["$lastUpdated", "$createdOn"] },
                1000 * 60 * 60 * 24 // Convert milliseconds to days
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "employees", // Join with employees collection to get category
          localField: "_id",
          foreignField: "employeeName", // Assuming assignedTo is the employee name
          as: "employeeInfo"
        }
      },
      {
        $unwind: "$employeeInfo"
      },
      {
        $project: {
          employeeName: "$_id",
          avgResolutionTime: 1,
          category: "$employeeInfo.category"
        }
      }
    ]);

    res.status(200).json(avgResolutionTime);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  addComplaint,
  updateComplaint,
  listComplaintsByUser,
  listComplaintById,
  deleteComplaint,
  getComplaintsOverTime,
  getComplaintsByCategory,
  getAverageResolutionTime,
  getComplaintPriorityDistribution,
  getTopComplaintGenerators,
  getComplaintsByUserType,
  getMonthlyQuarterlyComparison,
  getResolutionRate,
  getEmployeeAvgResolutionTime,
  getComplaintsByLocation
};


