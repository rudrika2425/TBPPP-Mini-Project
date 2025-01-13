const express=require("express");
const app=express();
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const connectDB = require("./db");

app.get("/",(req,res)=>{
   res.send("Backend for Inshare");
})

connectDB();

app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server is connected on ${PORT}`);
})
