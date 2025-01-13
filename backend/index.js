const express=require("express");
const app=express();
const PORT=8000;
const mongoose=require("mongoose");

app.listen(PORT,()=>{
    console.log("server connected");
})
