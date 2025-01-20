const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const fileSchema=new Schema({
    filename: String,
    path: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
    
})

const File=mongoose.model('File',fileSchema);
module.exports=File;