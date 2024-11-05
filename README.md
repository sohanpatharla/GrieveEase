
# GrieveEase

**Effortless Complaint Resolution**

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

GrieveEase is an online grievance redressal system designed to provide effortless complaint resolution. It allows users to submit complaints, track their status in real-time, and ensures complaints are addressed promptly through an efficient escalation mechanism. The system is built with a robust tech stack and offers role-based access control, comprehensive dashboards, and various analytics features.

## Features

- **User Management**: Admin can manage user profiles and roles.
- **Complaint Management**: Users can file complaints, and administrators can track, update, and resolve them.
- **Employee Management**: Admin can manage employee profiles and assign complaints to them.
- **Analytics**: Real-time data visualization for complaints status, time-based metrics, categories, and priorities.
- **Authentication**: Secure login and authentication using JWT.
- **Role-Based Access Control**: Different access levels for users, employees, and admins.
- **Escalation Mechanism**: Automatic escalation of unresolved complaints.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: RESTful APIs using Axios for HTTP requests
- **Authentication**: JSON Web Tokens (JWT)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/GrieveEase.git
   cd GrieveEase
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```

5. **Start frontend server:**
   ```bash
   cd ../frontend
   npm start
   ```

## Project Structure

```
GrieveEase/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── AdminDashboard.js
│   └── package.json
└── README.md
```

## Usage

- **Admin Dashboard**: Provides functionalities for fetching and managing users, complaints, employees, and analytics.
- **User Dashboard**: Allows users to submit complaints and track their status.
- **Employee Dashboard**: Enables employees to manage assigned complaints.

## API Endpoints

### User Routes
- **GET** `/users/profiles`: Fetch all user profiles.
- **POST** `/users/register`: Register a new user.
- **POST** `/users/login`: Login a user.

### Admin Routes
- **GET** `/admin/complaints`: Fetch all complaints.
- **GET** `/admin/complaint/:id`: Fetch a specific complaint by ID.
- **DELETE** `/admin/delete/:id`: Delete a specific complaint by ID.
- **PUT** `/admin/updateComplaint/:id`: Update a specific complaint by ID.
- **GET** `/admin/openStatus`: Fetch complaints with open status.
- **GET** `/admin/closedStatus`: Fetch complaints with closed status.
- **GET** `/admin/employees`: Fetch all employee profiles.
- **POST** `/admin/addEmployee`: Add a new employee.
- **PUT** `/admin/updateEmployee/:employeeId`: Update a specific employee by ID.
- **DELETE** `/admin/deleteEmployee/:employeeId`: Delete a specific employee by ID.
- **GET** `/admin/analytics`: Fetch analytics data.

### Employee Routes
- **GET** `/employee/complaints`: Fetch complaints assigned to the employee.

## Contributing

We welcome contributions from the community! Please read the following guidelines before submitting a pull request:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
