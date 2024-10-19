import React from 'react';

const EmployeeManagement = ({ employees, handleAddEmployee, handleUpdateEmployee, handleDeleteEmployee }) => {
  return (
    <div>
      <h2>Employee Management</h2>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>{employee.name}</li>
        ))}
      </ul>
      {/* Add form for adding/updating/deleting employees */}
    </div>
  );
};

export default EmployeeManagement;
