const mongoose=require("mongoose");

const MONGO_URI="mongodb://localhost:27017/Inshare"; 

const connectDB=async()=>{
  try{
    await mongoose.connect(MONGO_URI); 
    console.log("MongoDB connected successfully");
  }
  catch(err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
};

module.exports=connectDB;
