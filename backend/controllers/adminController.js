    const jwt = require("jsonwebtoken");
    const Admin = require('../models/adminModel');
    const Employee = require('../models/employeeModel');
    const Complaint = require('../models/complaintModel');

    async function loginAdmin(req, res) {
        console.log(req.body);
        const { email, password ,role} = req.body;
        const companyEmail=email;
    
        try {
        const admin = await Admin.findOne({ companyEmail });
        if (!admin) {
            console.log(`Admin not found`);
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        else{
            console.log("Admin found");
        }
    
        // const isMatch = await bcrypt.compare(password, employee.password);
        let isMatch=true;
        if(password === admin.password)
            {
            isMatch=true;
            }
            else{
            isMatch=false;
            }
        if (!isMatch) {
            console.log('Incorrect password');
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        else{
            console.log('Correct password');
        }
    
        const payload = {
            user: {
            id: admin.id,
            role: admin.role,
            name:admin.username
            },
        };
    
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
            (err, token) => {
            if (err) throw err;
            console.log({token});
            res.json({ token });
            }
        );
        } catch (err) {
        console.log(`error signing token`);
        console.log(err.message);
        res.status(500).send("Server error");
        }
    }
    // Function to get all complaints
    const getAllComplaints = async (req, res) => {
        try {
            const complaints = await Complaint.find();
            res.status(200).json(complaints);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    const getComplaint = async (req, res) => {
        const { id } = req.params;
        try {
            const complaintId = await Complaint.findOne({ complaintId: id });
            console.log('Found Complaint ID:', complaintId); // Log the found complaint

            if (complaintId) {
                const complaint = await Complaint.findById(complaintId._id);
                //console.log('Found Complaint:', complaint); // Log the found complaint
                res.status(200).json(complaint);
            } else {
                res.status(404).json({ error: 'Complaint not found' });
            }
        } catch (error) {
            console.error('Error fetching complaint:', error); // Log the error
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async function deleteComplaint(req, res) {
        const { id } = req.params;
        console.log(id); // Log the received ID
        try {
            const complaint = await Complaint.findOne({ complaintId: id });
            console.log('Found Complaint:', complaint); // Log the found complaint
            if (!complaint) {
                return res.status(404).json("No complaint available");
            }

            await Complaint.findOneAndDelete({ _id: complaint._id });

            return res.status(200).json("Complaint deleted successfully");

        } catch (err) {
            console.error('Error deleting complaint:', err); // Log the error
            return res.status(500).json(err);
        }
    }

    const getAllEmployees = async (req, res) => {
        try {
            const employees = await Employee.find();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Function to add a new employee
    const addEmployee = async (req, res) => {
        const { companyEmail, employeeId, employeeName, username, password, mobileNumber } = req.body;
        console.log(req.body);
        console.log(req.user);
        const addedBy = req.user.username; // Make sure to authenticate and get the admin's user ID
    
        try {
        const newEmployee = new Employee({
            companyEmail,
            employeeId,
            employeeName,
            username,
            password,
            mobileNumber,
            addedBy
        });
        console.log(`new employee is ${newEmployee}`);
        await newEmployee.save();
        res.status(201).json(newEmployee);
        } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    

    // Function to update an employee
    const updateEmployee = async (req, res) => {
        const { id } = req.params;
        console.log(req.params);
        console.log(id);
        const { companyEmail, employeeId, employeeName, username, password, mobileNumber } = req.body;
        const addedBy = req.user.id; 
        

        try {
            const updatedEmployee_id = await Employee.findOne({ employeeId: id });
            console.log(`my id is ${updatedEmployee_id}`);
            if(updatedEmployee_id)
                {
                    const updatedEmployee = await Employee.findByIdAndUpdate(
                        updatedEmployee_id,
                        { companyEmail, employeeId, employeeName, username, password, mobileNumber, addedBy },
                        { new: true }
                    );
                    res.status(200).json(updatedEmployee);
                }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    // Function to delete an employee
    const deleteEmployee = async (req, res) => {
        const { id } = req.params;

        try {
            const emp = await Employee.findOne({ employeeId: id });
            await Employee.findOneAndDelete({ _id: emp._id });
            res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Function to map a complaint to an employee
    const mapComplaint = async (req, res) => {
        const { id } = req.params;
        const { assignedTo } = req.body;
        try {
            const complaintId = await Complaint.findOne({ complaintId: id });
            console.log('Found Complaint ID:', complaintId); // Log the found complaint

            if (complaintId) {
                const complaint = await Complaint.findByIdAndUpdate(complaintId._id, { assignedTo }, { new: true });
                //console.log('Found Complaint:', complaint); // Log the found complaint
                res.status(200).json(complaint);
            } else {
                res.status(404).json({ error: 'Complaint not found' });
            }
        } catch (error) {
            console.error('Error assigning complaint:', error); // Log the error
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Function to update a complaint
    const updateComplaint = async (req, res) => {
        const { id } = req.params;
        const { complaintName, complaintContent, comments, assignedTo, status } = req.body;

        try {
            const updatedComplaint_id = await Complaint.findOne({ complaintId: id });
            //console.log('Found Complaint ID:', updatedComplaint_id); // Log the found complaint

            if (updatedComplaint_id) {
                const updatedComplaint = await Complaint.findByIdAndUpdate(
                    updatedComplaint_id._id,
                    { complaintName, complaintContent, comments, status, assignedTo },
                    { new: true }
                );
                //console.log('Updated Complaint:', updatedComplaint); // Log the updated complaint
                res.status(200).json(updatedComplaint);
            } else {
                res.status(404).json({ error: 'Complaint not found' });
            }
        } catch (error) {
            console.error('Error updating complaint:', error); // Log the error
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    // Function to get all open complaints
    const openStatus = async (req, res) => {
        try {
            const openComplaints = await Complaint.find({ status: 'Pending' });
            res.status(200).json(openComplaints);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Function to get all closed complaints
    const closedStatus = async (req, res) => {
        try {
            console.log('In closed status');
            const closedComplaints = await Complaint.find({ status: 'Closed' });
            console.log(closedComplaints);
            res.status(200).json(closedComplaints);

        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    // Function to get the count of complaints by status
    const getComplaintStatuses = async (req, res) => {
        try {
            console.log('In complaint stattuses');
            const complaints = await Complaint.find({});
            const statusCount = complaints.reduce((acc, complaint) => {
                acc[complaint.status] = (acc[complaint.status] || 0) + 1;
                return acc;
            }, {});
            res.status(200).json(statusCount);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    module.exports = {
        loginAdmin,
        getAllComplaints,
        getComplaint,
        deleteComplaint,
        getAllEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        mapComplaint,
        updateComplaint,
        openStatus,
        closedStatus,
        getComplaintStatuses
    };
