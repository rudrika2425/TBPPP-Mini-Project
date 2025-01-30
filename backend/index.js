const express = require("express"); 
const app=express();
require("dotenv").config();
const Upload=require('./routes/uploadRoute')
const cookieParser = require("cookie-parser");
const connectDB=require('./db');
const userRoute = require('./routes/userRoute');
const path=require('path')
const PORT = process.env.PORT || 8000;


const cors = require('cors');

app.use(cors({
    origin:"http://127.0.0.1:5501",
    credentials:true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

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
