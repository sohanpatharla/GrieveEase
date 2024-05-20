const express=require('express');
const app=express();
const mongoose=require('mongoose');
const stuRouter=require('./routes/stu.router');

mongoose.connect('mongodb://localhost:27017/stuDb').then(()=>{console.log("Connected to MongoDB")});


app.use(express.json())

app.use('/',stuRouter);

app.listen(3000,(req,res)=>{console.log("Server running on port 3000")})