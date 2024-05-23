const Admin = require('../models/adminModel');
const Employee = require('../models/employeeModel');
const Complaint = require('../models/complaintModel');

// Function to get all complaints
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to add a new employee
const addEmployee = async (req, res) => {
    const { companyEmail, employeeId, employeeName, username, password, mobileNumber } = req.body;
    const addedBy = req.user.id;

    try {
        const newEmployee = new Employee({ companyEmail, employeeId, employeeName, username, password, mobileNumber, addedBy });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update an employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { companyEmail, employeeId, employeeName, username, password, mobileNumber } = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, { companyEmail, employeeId, employeeName, username, password, mobileNumber }, { new: true });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete an employee
const deleteEmployee = async (req, res) => {
    const { id } = req.body;

    try {
        await Employee.findByIdAndDelete(id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to map a complaint to an employee
const mapComplaint = async (req, res) => {
    const { id } = req.params;
    const { resolvedBy } = req.body;

    try {
        const complaint = await Complaint.findByIdAndUpdate(id, { resolvedBy }, { new: true });
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a complaint
const updateComplaint = async (req, res) => {
    const { id } = req.params;
    const { complaintName, complaintContent, status } = req.body;
    const updatedComplaint_id = await Complaint.findOne({complaintId : id})
    if(updatedComplaint_id){
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(updatedComplaint_id._id, { complaintName, complaintContent, status }, { new: true });
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
};

// Function to get all open complaints
const openStatus = async (req, res) => {
    try {
        const openComplaints = await Complaint.find({ status: 'open' });
        res.status(200).json(openComplaints);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get all closed complaints
const closedStatus = async (req, res) => {
    try {
        const closedComplaints = await Complaint.find({ status: 'closed' });
        res.status(200).json(closedComplaints);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllComplaints,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    mapComplaint,
    updateComplaint,
    openStatus,
    closedStatus
};
