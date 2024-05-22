require('dotenv').config();

const express = require('express');
const session = require('express-session')
const connectDB = require('./backend/MongoDBConfig/DataBase');
const userRoutes = require('./backend/routes/login_signup.routes');
const complaintRoutes = require('./backend/routes/complaint.routes');

const app = express();

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(session(
    {
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:true,
        cookie: { maxAge: 60 * 60 * 1000 } // 1 hour (in milliseconds)

    }
))

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
