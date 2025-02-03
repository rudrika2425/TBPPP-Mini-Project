const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const fileSchema=new Schema({
    filename:{
        type:String,
        required:true
    } ,
    path:{
        type:String,
        required:true
    }  ,
    size: {
        type:Number,
        required:true,
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    },
    uuid:{
        type:String,
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    expirationDate: { type: Date, required: true },
    // receiver:{
    //     type:String,
    //     required:true
    // }
    
},{timestamps:true})

const File=mongoose.model('File',fileSchema);
module.exports=File;