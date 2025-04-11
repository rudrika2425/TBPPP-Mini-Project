const express = require("express"); 

const cookieParser = require("cookie-parser");
const connectDB=require('./db');

const path=require('path')
const cronJob = require('./cronJob');

const app=express();
require("dotenv").config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin:"http://127.0.0.1:5501",
    credentials:true
}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

connectDB();

app.get("/",(req,res)=>{
   res.send("Backend for Inshare");
})

app.use(express.json());
app.use(cookieParser());
const userRoute = require('./routes/userRoute');
const Upload=require('./routes/uploadRoute')

app.use('/upload',Upload);
app.use("/user",userRoute);

app.listen(PORT,()=>{
    console.log(`server is connected on ${PORT}`);
});

cronJob();
