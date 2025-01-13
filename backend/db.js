const mongoose=require("mongoose");
require("dotenv").config();

const MONGO_URI=process.env.MONGO_URI; 

const connectDB=async()=>{
  try{
    await mongoose.connect(MONGO_URI); 
    console.log("MongoDB connected successfully");
  }
  catch(err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports=connectDB;
