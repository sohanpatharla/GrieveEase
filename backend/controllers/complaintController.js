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

async function classifyAndUpdateComplaint(complaintId, complaintContent) {
  try {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "\"GrieveEase is an online grievance redressal system designed to simplify the process of filing, tracking, and resolving complaints for various organizations, including educational institutions, corporate offices, and private organizations. The platform provides users with a streamlined interface to submit complaints, track their resolution status in real-time, and ensure they are addressed promptly through an efficient escalation mechanism.\n\nThe system includes comprehensive features such as user management, complaint management, employee management, real-time analytics, role-based access control, and secure authentication using JSON Web Tokens (JWT). The frontend of GrieveEase is built using React.js, while the backend is powered by Node.js and Express.js, with MongoDB serving as the database.\n\nObjective:\nYou are tasked with classifying complaints into predefined categories based on the text descriptions provided by users when they submit their complaints. The categories are designed to be general and applicable across multiple types of organizations. Your job is to analyze the content of the complaint and determine the most appropriate category from the following:\n\nTechnical Issues\nService Quality\nEmployee Conduct\nFacilities and Infrastructure\nBilling and Payments\nCustomer Support\nCompliance and Legal\nProduct or Service Defects\nSecurity and Privacy\nGeneral Feedback and Suggestions\nEach complaint description will provide detailed context, and your output should be a single word representing the category that best fits the complaint. The system relies on your ability to understand the nuances in the text and accurately classify the complaints to improve the efficiency of the redressal process.\""},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "##  Complaint Classification System for GrieveEase\n\nThis system utilizes a combination of keyword analysis and contextual understanding to classify complaints.  The following is a breakdown of the categories and key elements for classification:\n\n**1. Technical Issues:**  Focus on technology, software, hardware, network issues, etc. Keywords: **network, software, hardware, website, server, error, bug, system, login, internet, access, connection, download, upload, printer, scanner, email, file, data, crash, slow, unresponsive** \n\n**2. Service Quality:**  Concerns about the quality of service provided. Keywords: **service, delivery, response, wait time, appointment, customer service, communication,  delay, incomplete, unsatisfactory, rude, unhelpful, unprofessional,  unresponsive,  inefficient,  overcrowded,  disorganized,  lack of attention,  poor communication,  misinformation**\n\n**3. Employee Conduct:**  Inappropriate behavior, lack of professionalism, discrimination, harassment, etc. Keywords: **employee, staff, manager, supervisor, unprofessional, rude, disrespectful, abusive, discriminatory, harassing, biased, unfair, unethical,  unjust,  incompetent,  negligent,  unqualified,  unethical,  unlawful,  inappropriate**\n\n**4. Facilities and Infrastructure:**  Issues with building, equipment, environment, accessibility, etc. Keywords: **building, facilities, infrastructure, equipment, maintenance, repairs, cleanliness, safety, accessibility, temperature, noise, lighting, space, parking, restrooms,  security,  crowded,  unsafe,  uncomfortable,  unhygienic,  broken,  damaged,  lack of maintenance,  inadequate facilities,  unsuitable environment**\n\n**5. Billing and Payments:**  Incorrect billing, payment issues, disputes, refunds, etc. Keywords: **billing, payment, invoice, charges, fees, balance, refund, credit card, debit card,  overcharge,  incorrect charges,  late payment,  payment processing error,  unpaid bills,  dispute,  fraud,  billing error,  payment error**\n\n**6. Customer Support:**  Issues with the responsiveness, helpfulness, and professionalism of customer support. Keywords: **customer service, support, response,  communication,  resolution,  help,  issue,  complaint,  problem,  assistance,  resolution,  contact,  phone,  email,  chat,  wait time,  unhelpful,  rude,  unresponsive,  incompetent,  unprofessional**\n\n**7. Compliance and Legal:**  Issues related to legal requirements, regulations, policies, etc. Keywords: **compliance, legal, regulation, policy, contract, law,  privacy,  security,  discrimination,  harassment,  fraud,  violation,  unethical,  illegal,  unlawful,  misconduct,  violation of policy,  violation of law,  breach of contract,  breach of privacy,  security breach,  discrimination,  harassment**\n\n**8. Product or Service Defects:**  Issues with the quality, functionality, and performance of products or services. Keywords: **product, service, defect, malfunction, damage, error,  failure,  quality,  performance,  durability,  functionality,  issue,  problem,  broken,  damaged,  defective,  faulty,  incomplete,  unusable,  non-functional,  not working,  poor quality,  substandard**\n\n**9. Security and Privacy:**  Issues related to data security, privacy breaches, unauthorized access, etc. Keywords: **security, privacy, data, information, breach, hack, unauthorized access, password,  personal data,  sensitive information,  data protection,  cybersecurity,  leak,  theft,  fraud,  vulnerability,  system security,  network security,  data breach,  privacy violation,  identity theft,  cybercrime**\n\n**10. General Feedback and Suggestions:**  General comments, feedback, suggestions, and recommendations for improvement. Keywords: **feedback, suggestion, improvement,  recommendation,  opinion,  comment,  idea,  review,  general,  overall,  experience,  satisfaction,  satisfaction,  quality,  service,  process,  system,  design,  functionality,  ease of use,  customer experience,  user experience,  user interface**\n\n**Classification Process:**\n\n1. **Identify keywords:**  Analyze the complaint text for keywords related to each category.\n2. **Contextual understanding:**  Consider the context of the complaint and its relationship to the user's experience with the organization. \n3. **Prioritization:**  If multiple categories apply, prioritize based on the main focus of the complaint.\n\n**Example Complaints:**\n\n* \"My internet connection is very slow and keeps disconnecting. I can't access the website properly.\" **-> Technical Issues**\n* \"The cashier was rude and unhelpful when I tried to return an item.\" **-> Employee Conduct**\n* \"The water heater in the ladies' bathroom is broken and has been for a week.\" **-> Facilities and Infrastructure**\n* \"I was charged twice for the same service.\" **-> Billing and Payments**\n* \"I couldn't get through to customer support by phone for over an hour.\" **-> Customer Support**\n* \"My personal information was leaked in a recent data breach.\" **-> Security and Privacy**\n* \"The company's new website is difficult to navigate and confusing.\" **-> General Feedback and Suggestions** \n\n**Note:** This is a starting point, and the classification system will need to be continuously improved and refined based on the specific needs and data of GrieveEase.  Machine learning algorithms can be integrated into the system to further enhance the accuracy and efficiency of complaint classification. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Examples for Training:\n\nDescription: \"The software update caused my computer to freeze multiple times, and I lost important files.\"\n\nCategory: Technical Issues\nDescription: \"I waited over 30 minutes on hold just to be transferred to another department that couldn't help me.\"\n\nCategory: Service Quality\nDescription: \"The receptionist was very dismissive and refused to listen to my concerns about the appointment scheduling.\"\n\nCategory: Employee Conduct\nDescription: \"The elevators have been out of service for days, making it difficult for elderly people to access the upper floors.\"\n\nCategory: Facilities and Infrastructure\nDescription: \"I noticed an unauthorized charge on my credit card from your company, and I'm unable to get it refunded.\"\n\nCategory: Billing and Payments\nDescription: \"I sent an email to customer support a week ago, and I haven't received any response yet.\"\n\nCategory: Customer Support\nDescription: \"The terms and conditions of the service were not clearly explained, leading to a misunderstanding of the contract.\"\n\nCategory: Compliance and Legal\nDescription: \"The product I received was broken in the box, and it doesn't work at all. I need a replacement.\"\n\nCategory: Product or Service Defects\nDescription: \"My account was hacked, and sensitive information was stolen. I'm worried about the security of your systems.\"\n\nCategory: Security and Privacy\nDescription: \"The new mobile app is very difficult to use, and I think it needs a simpler design.\"\n\nCategory: General Feedback and Suggestions\nDescription: \"After the latest system update, I can no longer connect to the company's VPN. This is affecting my ability to work remotely.\"\n\nCategory: Technical Issues\nDescription: \"The customer service agent I spoke to was extremely rude and kept interrupting me while I was explaining my problem.\"\n\nCategory: Employee Conduct\nDescription: \"The air conditioning in the office has been broken for weeks, making the environment uncomfortable to work in.\"\n\nCategory: Facilities and Infrastructure\nDescription: \"I was charged a late fee even though I paid my bill on time. This is unacceptable.\"\n\nCategory: Billing and Payments\nDescription: \"I tried calling your customer service multiple times, but each time, the call dropped after long wait times.\"\n\nCategory: Customer Support\nDescription: \"I was not informed about the changes in the privacy policy, which now exposes my data to third-party vendors.\"\n\nCategory: Compliance and Legal\nDescription: \"The blender I bought stopped working after just one week of use. This is disappointing for a brand-new product.\"\n\nCategory: Product or Service Defects\nDescription: \"I received a notification that my account was accessed from an unknown location. How secure is your platform?\"\n\nCategory: Security and Privacy\nDescription: \"The new interface is cluttered, and it's hard to find the features I used to use frequently.\"\n\nCategory: General Feedback and Suggestions\nDescription: \"The website frequently crashes when I try to upload documents, which is frustrating when I'm on a deadline.\"\n\nCategory: Technical Issues\nDescription: \"The staff at the front desk was very unprofessional, making jokes about customers in front of everyone.\"\n\nCategory: Employee Conduct\nDescription: \"The parking lot is always full, and there's no proper lighting at night, which makes it unsafe.\"\n\nCategory: Facilities and Infrastructure\nDescription: \"I was billed for services I didn't use, and it's been a hassle to get a refund.\"\n\nCategory: Billing and Payments\nDescription: \"The live chat support kept disconnecting, and no one followed up on my issue.\"\n\nCategory: Customer Support\nDescription: \"Your company's handling of sensitive data is concerning, especially with the recent data breaches in the news.\"\n\nCategory: Security and Privacy\nDescription: \"The checkout process on your website is too complicated and takes too long to complete.\"\n\nCategory: General Feedback and Suggestions\n\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "These training examples are excellent for building a robust complaint classification system for GrieveEase. They demonstrate the nuances and variations within each category. \n\nHere's a breakdown of how these examples highlight key aspects of classification:\n\n**Technical Issues:**  Focus on software, hardware, system errors, connectivity, and data loss.  \n* **Keywords:**  software update, computer freeze, files lost, VPN connection, website crashes, document upload\n* **Context:**  Issues directly related to technology, its functionality, and user experience.\n\n**Service Quality:**  Concerns about the quality of service received, including wait times, communication, and responsiveness.\n* **Keywords:**  wait time, transfer, department, hold, response, email, appointment scheduling, call drop\n* **Context:**  Issues related to the overall experience of interacting with the service.\n\n**Employee Conduct:**  Concerns about inappropriate or unprofessional behavior by employees. \n* **Keywords:**  receptionist, dismissive, rude, unprofessional, interrupting, jokes, making fun of customers\n* **Context:**  Behaviors of specific individuals that impact customer experience negatively.\n\n**Facilities and Infrastructure:** Issues related to the physical environment, equipment, accessibility, and maintenance.\n* **Keywords:**  elevators, air conditioning, parking lot, lighting,  broken, out of service, full, unsafe\n* **Context:**  Issues affecting the physical environment and its impact on usability or safety.\n\n**Billing and Payments:**  Issues with billing accuracy, charges, payments, refunds, and late fees. \n* **Keywords:**  charge, credit card, unauthorized, refund, late fee, billed, services, payment, on time\n* **Context:**  Issues related to financial transactions and their accuracy.\n\n**Customer Support:**  Concerns about the responsiveness, helpfulness, and professionalism of customer support.\n* **Keywords:**  customer service, email, response, wait time, call drop, live chat, disconnecting, follow up\n* **Context:**  Issues with the ability to access support, the quality of support received, and its effectiveness.\n\n**Compliance and Legal:**  Issues related to legal requirements, regulations, policies, data privacy, and contract terms.\n* **Keywords:**  terms and conditions, privacy policy, data breach, sensitive data, handling, informed, breach, contract, policy\n* **Context:**  Issues related to legal obligations, compliance with regulations, and data security.\n\n**Product or Service Defects:** Issues with the quality, functionality, and performance of products or services.\n* **Keywords:**  product, blender, broken, stopped working, new,  received, replacement,  faulty,  defective,  not working\n* **Context:**  Issues related to the quality and functionality of purchased goods or services.\n\n**Security and Privacy:**  Issues related to data security, privacy breaches, unauthorized access, and account security. \n* **Keywords:**  account hacked, sensitive information, stolen, security,  breaches, notification,  accessed, unknown location,  data protection\n* **Context:**  Concerns about the security of personal information and the platform's vulnerability to attacks.\n\n**General Feedback and Suggestions:**  General comments, feedback, suggestions, and recommendations for improvement. \n* **Keywords:**  interface, design, cluttered, complicated, difficult, checkout,  feedback, suggestions,  improvement,  recommendation,  new, features\n* **Context:**  Broader feedback on usability, design, features, and overall experience with the system or product.\n\n**Building the Classifier:**\n\nThese training examples can be used to train a machine learning model.  For example, you can use supervised learning techniques like:\n\n* **Naive Bayes:**  A probabilistic model that calculates the likelihood of a complaint belonging to a particular category based on the presence of specific keywords.\n* **Support Vector Machines (SVM):**  A classification algorithm that finds the best boundary between different complaint categories.\n* **Decision Trees:**  A tree-like structure that uses a series of rules to classify complaints based on various features. \n\nBy feeding these training examples to the model, it will learn to identify patterns and relationships between keywords and categories. This will allow the system to accurately classify future complaints with high precision.\n\n**Continual Improvement:**\n\nThe classification system should be continuously monitored and refined.  New complaints should be added to the training data, and the model should be retrained periodically to improve its accuracy. User feedback can also be incorporated to identify areas for improvement and enhance the system's effectiveness. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "now your task is to act as a complaint classifier for my application........using all the previous trained data \n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I'm ready to classify your complaints! Please provide the complaint description, and I'll do my best to categorize it using the training data and understanding I've gained.\n\n**For example, you could say:**\n\n\"I was overcharged for my monthly subscription, and I can't get a refund.\"\n\n**Or:**\n\n\"The website keeps crashing when I try to access my account.\"\n\n**Let's start classifying!** \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "The input I will be providing is only the description about that incident............based on it generate the single word output containing the category of that complaint"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it! I understand. Just provide the description, and I'll give you the corresponding category as a single word.  I'm ready! \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "The service representative I spoke to was very helpful, but my issue is still unresolved after several attempts\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Customer Support \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "The office cafeteria has a broken refrigerator, and the food stored there smells bad.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Facilities and Infrastructure \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I contacted customer support regarding an issue with my account, but I have not received a response in over a week. This delay in service is unacceptable, and I need this issue resolved immediately."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Customer Support \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "give me list of all categories in which all the complaints wouldbe classified into\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Here are all the categories for complaint classification, based on our training data:\n\n1. **Technical Issues**\n2. **Service Quality**\n3. **Employee Conduct**\n4. **Facilities and Infrastructure**\n5. **Billing and Payments**\n6. **Customer Support**\n7. **Compliance and Legal**\n8. **Product or Service Defects**\n9. **Security and Privacy**\n10. **General Feedback and Suggestions** \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`"${complaintContent}"`);
  const predictedCategory =result.response.text();
  //await Complaint.findByIdAndUpdate(complaintId, { category: predictedCategory });

    console.log(`Complaint ${complaintId} categorized as ${predictedCategory}`);
    return predictedCategory;
}
    catch (error) {
      console.error("Error classifying the complaint:", error);
    }

}

  async function addComplaint(req, res) {
    console.log("Working");
    console.log(req.user);
    let { complaintId, complaintName, complaintContent, priority, category, attachments, comments } = req.body;
     createdBy = req.user.name;
    category= await classifyAndUpdateComplaint(complaintId, complaintContent);
    
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


