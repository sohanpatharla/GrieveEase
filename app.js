require('dotenv').config();

const express = require('express');
const connectDB = require('./backend/MongoDBConfig/DataBase');
const userRoutes = require('./backend/routes/login_signup.routes');
const complaintRoutes = require('./backend/routes/complaint.routes');

const app = express();

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
