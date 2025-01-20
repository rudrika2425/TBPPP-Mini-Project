const multer = require('multer');
const File=require('../models/files');
const router=require('express').Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');   
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  
    }
  });

  const upload=multer({storage});

  router.post('/file',upload.single('file'),async (req,res)=>{

    try{
    if(!req.file){
        return res.status(400).json({error:'No file uploaded'});
    }

    const newFile = new File({
        filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size
    });

    await newFile.save();
    res.json({
        message:'File uploaded succesfully',
        file:req.file,

    }) 
    console.log(req.file.originalname);
    console.log(req.file.size);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
  })
module.exports=router;