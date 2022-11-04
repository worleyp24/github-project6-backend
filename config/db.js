const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "AppFamDB",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.green.inverse);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.inverse);
    process.exit;
  }
};

module.exports = connectDB;
