const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/grievance_redressal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
    });
    // await mongoose.connect('mongodb+srv://sohanpatharla:sohanpatharla@cluster0.vm3etby.mongodb.net/grievance_redressal', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   //useCreateIndex: true,
    // });
    console.log('Connection to DB successful');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
