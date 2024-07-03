import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import api from '../../api';
import ComplaintStatusOverview from './ComplaintStatusOverview';
import ComplaintsOverTime from "./ComplaintsOverTime";
import { useNavigate } from 'react-router-dom'; 

// import ComplaintStatusChart from './ComplaintStatusChart';
// import ComplaintTimeChart from './ComplaintTimeChart';
// import ComplaintCategoryChart from './ComplaintCategoryChart';
// import ComplaintPriorityChart from './ComplaintPriorityChart';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fetchedComplaint, setFetchedComplaint] = useState(null);
  const [showAssignField, setShowAssignField] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchUsers();
    await fetchComplaints();
    await fetchOpenComplaints();
    await fetchClosedComplaints();
    await fetchEmployees();
    await fetchAnalytics();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/users/profiles`);
      console.log("Fetched users:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  const fetchComplaint = async () => {
    try {
      const { id } = formData;
      console.log(formData)
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/complaint/${id}`);
      setFetchedComplaint(res.data);
      setMessage("Complaint fetched successfully!");
    } catch (error) {
      console.error("Error fetching complaint:", error.response || error.message);
      setMessage("Error fetching complaint");
    }
  }

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/complaints`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchOpenComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/openStatus`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching open complaints:", error);
    }
  };

  const fetchClosedComplaints = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/closedStatus`);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching closed complaints:", error);
    }
  };

  const handleDeleteComplaint = async () => {
    try {
      const { id } = formData;
      console.log(formData)
      await api.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/delete/${id}`);
      setFetchedComplaint(null);
      setMessage("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error.response || error.message);
      setMessage("Error deleting complaint");
    }
  }

  const fetchEmployees = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`);
      const data = res.data;
      setStatusData([
        { name: 'Pending', value: data.pending },
        { name: 'In Progress', value: data.inProgress },
        { name: 'Resolved', value: data.resolved },
        { name: 'Rejected', value: data.rejected }
      ]);
      setTimeData(data.timeData); // Assuming timeData is an array of {name: 'date', count: number}
      setCategoryData(data.categoryData); // Assuming categoryData is an array of {name: 'category', count: number}
      setPriorityData(data.priorityData); // Assuming priorityData is an array of {name: 'priority', count: number}
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${process.env.REACT_APP_BACKEND_URL}/admin/addEmployee`, formData);
      setMessage("Employee added successfully!");
      fetchEmployees();
    } catch (error) {
      setMessage("Error adding employee");
      console.error("Error adding employee:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    const { employeeId, ...updateData } = formData;
    console.log(formData);
    console.log(`this is the id${employeeId}`);
    try {
      await api.put(`${process.env.REACT_APP_BACKEND_URL}/admin/updateEmployee/${employeeId}`, updateData);
      setMessage("Employee updated successfully!");
      setFormData({});
    } catch (error) {
      setMessage("Error updating employee");
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async () => {
    const { employeeId } = formData;
    try {
      await api.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteEmployee/${employeeId}`);
      setMessage("Employee deleted successfully!");
    } catch (error) {
      setMessage("Error deleting employee");
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = formData;
      await api.put(`${process.env.REACT_APP_BACKEND_URL}/admin/updateComplaint/${id}`, updateData);
      setMessage("Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating complaint:", error.response || error.message);
      setMessage("Error updating complaint");
    }
  };

  const mapfield = () => {
    setShowAssignField(true);
  }

  const handleMapComplaint = async (e) => {
    e.preventDefault();
    const { id } = formData;
    try {
      await api.post(`${process.env.REACT_APP_BACKEND_URL}/admin/mapComplaint/${id}`, { assignedTo: employeeName });
      setMessage('Complaint updated successfully!');
    } catch (error) {
      console.error('Error mapping complaint:', error.response || error.message);
      setMessage('Error updating complaint');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to login page
  };


  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button className={activeTab === "userManagement" ? "active" : ""} onClick={() => handleTabChange("userManagement")}>
          User Management
        </button>
        <button className={activeTab === "complaintManagement" ? "active" : ""} onClick={() => handleTabChange("complaintManagement")}>
          Complaint Management
        </button>
        <button className={activeTab === "statusManagement" ? "active" : ""} onClick={() => handleTabChange("statusManagement")}>
          Status Management
        </button>
        <button className={activeTab === "employeeManagement" ? "active" : ""} onClick={() => handleTabChange("employeeManagement")}>
          Employee Management
        </button>
        <button className={activeTab === "dashboardAnalytics" ? "active" : ""} onClick={() => handleTabChange("dashboardAnalytics")}>
          Dashboard Analytics
        </button>
      </div>
      <div className="dashboard-content">
        {message && <p className="message">{message}</p>}
        {activeTab === "userManagement" && (
          <div>
            <h2>User Data</h2>
            <div className="buttons">
              <button onClick={fetchUsers}>Fetch Users</button>
            </div>
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user._id}>{user.name} - {user.email}</li>
                ))}
              </ul>
            ) : (
              <p>No users found. Click "Fetch Users" to load data.</p>
            )}
          </div>
        )}
        {activeTab === "complaintManagement" && (
          <div>
            <h2>Complaint Management</h2>
            <form onSubmit={handleUpdateComplaint}>
              <input type="text" name="id" placeholder="Complaint ID" onChange={handleInputChange} />
              <input type="text" name="complaintName" placeholder="Complaint Name" onChange={handleInputChange} />
              <input type="text" name="complaintContent" placeholder="Complaint Content" onChange={handleInputChange} />
              <input type="text" name="comments" placeholder="Comments" onChange={handleInputChange} />
              <input type="text" name="status" placeholder="Status" onChange={handleInputChange} />
              <input type="text" name="assignedTo" placeholder="Assigned To" onChange={handleInputChange} />
              <button type="submit">Update Complaint</button>
            </form>
            <div className="buttons">
              <button onClick={fetchComplaints}>All Complaints</button>
              <button onClick={fetchOpenComplaints}>Open Complaints</button>
              <button onClick={fetchClosedComplaints}>Closed Complaints</button>
            </div>
            {complaints.length > 0 ? (
              <ul>
                {complaints.map((complaint) => (
                  <li key={complaint._id}>{complaint.complaintName} - {complaint.status}</li>
                ))}
              </ul>
            ) : (
              <p>No complaints found. Click "Complaint Buttons" to load data.</p>
            )}
          </div>
        )}
        {activeTab === "statusManagement" && (
          <div>
            <h2>Status Management</h2>
            <form>
              <input type="text" name="id" placeholder="Complaint ID" onChange={handleInputChange} />
            </form>
            <button onClick={fetchComplaint}>FetchStatuses</button>
            <button onClick={mapfield}>AssignTo</button>
            <button onClick={handleDeleteComplaint}>DeleteComplaint</button>
            {fetchedComplaint ? (
              <p>{fetchedComplaint.complaintName} - {fetchedComplaint.status}</p>
            ) : (
              <p>No complaint found. Click "fetch Complaint" to load data.</p>
            )}
            {showAssignField && (
              <div>
                <input type="text" name="employeeName" placeholder="Employee Name" onChange={handleEmployeeNameChange} />
                <button onClick={handleMapComplaint}>Update</button>
              </div>
            )}
          </div>
        )}
        {activeTab === "employeeManagement" && (
          <div>
            <h2>Employee Management</h2>
            <form onSubmit={handleAddEmployee}>
              <input type="text" name="companyEmail" placeholder="Company Email" onChange={handleInputChange} required />
              <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleInputChange} required />
              <input type="text" name="employeeName" placeholder="Employee Name" onChange={handleInputChange} required />
              <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
              <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleInputChange} />
              <button type="submit">Add Employee</button>
            </form>
            <button onClick={() => handleUpdateEmployee()}>Update</button>
            <button onClick={() => handleDeleteEmployee()}>Delete</button>
            <div className="buttons">
              <button onClick={fetchEmployees}>All Employees</button>
            </div>
            {employees.length > 0 ? (
              <ul>
                {employees.map((employee) => (
                  <li key={employee._id}>{employee.employeeEmail} - {employee.employeeName}</li>
                ))}
              </ul>
            ) : (
              <p>No employee found. Click "All Employees" to load data.</p>
            )}
          </div>
        )}
        {activeTab === "dashboardAnalytics" && (
          <div>
            <h2>Dashboard Analytics</h2>
            <button className="btn btn-danger logout-button" onClick={handleLogout}>Logout</button>
            <ComplaintStatusOverview />
            <h3>Complaints Over time analysis</h3>
            <ComplaintsOverTime />
            {/* <ComplaintStatusChart data={statusData} /> */}
            {/* <ComplaintTimeChart data={timeData} /> */}

            {/* <ComplaintCategoryChart data={categoryData} /> */}


            {/* <ComplaintPriorityChart data={priorityData} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
