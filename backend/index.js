const express=require("express");
const app=express();
require("dotenv").config();
const Upload=require('./routes/uploadRoute')
const PORT = process.env.PORT || 8000;
const connectDB=require('./db');
connectDB()
;
app.get("/",(req,res)=>{
   res.send("Backend for Inshare");
})

app.use('/upload',Upload);
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server is connected on ${PORT}`);
})
