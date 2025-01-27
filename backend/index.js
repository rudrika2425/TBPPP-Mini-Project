const express = require("express"); 
const app=express();
require("dotenv").config();
const Upload=require('./routes/uploadRoute')
const cookieParser = require("cookie-parser");
const connectDB=require('./db');
const userRoute = require('./routes/userRoute');

const PORT = process.env.PORT || 8000;

const cors = require('cors');

app.use(cors());


connectDB();

app.get("/",(req,res)=>{
   res.send("Backend for Inshare");
})

app.use(express.json());
app.use(cookieParser());

app.use('/upload',Upload);
app.use("/user",userRoute);

app.listen(PORT,()=>{
    console.log(`server is connected on ${PORT}`);
});
//http://localhost:8000/upload/file