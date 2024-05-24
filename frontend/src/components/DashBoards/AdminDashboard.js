import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fetchedComplaint, setFetchedComplaint] = useState(null);
  const [showAssignField, setShowAssignField] = useState(false); // State to hold fetched complaint
  //const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  //const [analytics, setAnalytics] = useState({});
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   await fetchUsers();
  //   await fetchComplaints();
  //   await fetchOpenComplaints();
  //   await fetchClosedComplaints();
  //   //await fetchStatuses();
  //   await fetchEmployees();
  //   //await fetchAnalytics();
  // };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/profiles");
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
      const res = await axios.get(
        `http://localhost:5000/api/admin/complaint/${id}`
      );
      setFetchedComplaint(res.data);
      setMessage("Complaint fetched successfully!");
    } catch (error) {
      console.error("Error fetching complaint:", error.response || error.message);
      setMessage("Error fetching complaint");
    }
  }

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/complaints");
      //console.log("Fetched Complaints:", res.data);
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchOpenComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/openStatus");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching open complaints:", error);
    }
  };

  const fetchClosedComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/closedStatus"
      );
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching closed complaints:", error);
    }
  };

  const handleDeleteComplaint = async () => {
    try {
      const { id } = formData;
      console.log(formData)
      await axios.delete(
        `http://localhost:5000/api/admin/delete/${id}`
      );
      setFetchedComplaint(null);
      setMessage("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error.response || error.message);
      setMessage("Error deleting complaint");
    }
  }

  // const fetchStatuses = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/admin/statuses');
  //     setStatuses(res.data);
  //   } catch (error) {
  //     console.error('Error fetching statuses:', error);
  //   }
  // };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // const fetchAnalytics = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/admin/analytics');
  //     setAnalytics(res.data);
  //   } catch (error) {
  //     console.error('Error fetching analytics:', error);
  //   }
  // };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/addEmployee",
        formData
      );
      setMessage("Employee added successfully!");
      fetchEmployees();
    } catch (error) {
      setMessage("Error adding employee");
      console.error("Error adding employee:", error);
    }
  };

  const handleUpdateEmployee = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/updateComplaint/${id}`,
        formData
      );
      setMessage("Employee updated successfully!");
      fetchEmployees();
    } catch (error) {
      setMessage("Error updating employee");
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/admin/deleteEmployee", {
        data: { id },
      });
      setMessage("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      setMessage("Error deleting employee");
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const { id, ...updateData } = formData;
      await axios.put(
        `http://localhost:5000/api/admin/updateComplaint/${id}`,
        updateData
      );
      //console.log(updateData)
      setMessage("Complaint updated successfully!");
      //fetchComplaints(); // Refresh the complaints list
    } catch (error) {
      console.error("Error updating complaint:", error.response || error.message);
      setMessage("Error updating complaint");
    }
  };


  // const handleMapComplaint = async (e) => {
  //   e.preventDefault();
  //   const { id } = formData;
  //   try {
  //     const res = await axios.post(
  //       `http://localhost:5000/api/admin/mapComplaint/${id}`,
  //       formData
  //     );
  //     setMessage("Complaint mapped successfully!");
  //     fetchComplaints();
  //   } catch (error) {
  //     setMessage("Error mapping complaint");
  //     console.error("Error mapping complaint:", error);
  //   }
  // }; 
  const mapfield = () => {
    setShowAssignField(true);
  }

  const handleMapComplaint = async () => {
    console.log(formData);
    console.log(employeeName);
    try {
      const { id } = formData;
      await axios.post(
        `http://localhost:5000/api/admin/mapComplaint/${id}`,
        { assignedTo: employeeName }
      );
      //setFetchedComplaint(res.data);
      setMessage('Complaint updated successfully!');
    } catch (error) {
      console.error('Error maping complaint:', error.response || error.message);
      setMessage('Error updating complaint');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button
          className={activeTab === "userManagement" ? "active" : ""}
          onClick={() => handleTabChange("userManagement")}
        >
          User Management
        </button>
        <button
          className={activeTab === "complaintManagement" ? "active" : ""}
          onClick={() => handleTabChange("complaintManagement")}
        >
          Complaint Management
        </button>
        <button
          className={activeTab === "statusManagement" ? "active" : ""}
          onClick={() => handleTabChange("statusManagement")}
        >
          Status Management
        </button>
        <button
          className={activeTab === "employeeManagement" ? "active" : ""}
          onClick={() => handleTabChange("employeeManagement")}
        >
          Employee Management
        </button>
        <button
          className={activeTab === "dashboardAnalytics" ? "active" : ""}
          onClick={() => handleTabChange("dashboardAnalytics")}
        >
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
                  <li key={user._id}>
                    {user.name} - {user.email}
                  </li>
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
              <input
                type="text"
                name="id"
                placeholder="Complaint ID"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="complaintName"
                placeholder="Complaint Name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="complaintContent"
                placeholder="Complaint Content"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="comments"
                placeholder="Comments"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="status"
                placeholder="Status"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="assignedTo"
                placeholder="Assigned To"
                onChange={handleInputChange}
              />
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
                  <li key={complaint._id}>
                    {complaint.complaintName} - {complaint.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No complaints found. Click "Complaint Buttons" to load data.
              </p>
            )}
          </div>
        )}
        {activeTab === "statusManagement" && (
          <div>
            <h2>Status Management</h2>
            <form>
              <input
                type="text"
                name="id"
                placeholder="Complaint ID"
                onChange={handleInputChange}
              />
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
              <input
                type="text"
                name="employeeName"
                placeholder="Employee Name"
                onChange={handleEmployeeNameChange}
              />
              <button onClick={handleMapComplaint}>Update</button>
            </div>
          )}
          </div>
        )}
        {activeTab === "employeeManagement" && (
          <div>
            <h2>Employee Management</h2>
            <form onSubmit={handleAddEmployee}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
              <button type="submit">Add Employee</button>
            </form>
            <ul>
              {employees.map((employee) => (
                <li key={employee.id}>
                  {employee.name} - {employee.email}
                  <button onClick={() => handleUpdateEmployee(employee.id)}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="buttons">
              <button onClick={fetchEmployees}>All Employees</button>
            </div>
            {employees.length > 0 ? (
              <ul>
                {employees.map((employee) => (
                  <li key={employee._id}>
                    {employee.employeeEmail} - {employee.employeeName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No employee found. Click "All Employees" to load data.</p>
            )}
          </div>
        )}
        {/* {activeTab === "dashboardAnalytics" && (
          <div>
            <h2>Dashboard Analytics</h2>
            <pre>{JSON.stringify(analytics, null, 2)}</pre>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
