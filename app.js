require('dotenv').config();
const express = require('express');
const connectDB = require('./backend/MongoDBConfig/DataBase');
const userRoutes = require('./backend/routes/userRoutes');
const cors = require('cors');   
const complaintRoutes = require('./backend/routes/complaintRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');
const verify = require('./backend/JWT_Auth/verify');
// const employeeRoutes = require('./backend/routes/employee.routes');


const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  };
  
  app.use(cors(corsOptions));

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);
// app.use('/ogrs/admin',adminRoutes);
// app.use('/ogrs/employee',employeeRoutes);


const PORT =5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
