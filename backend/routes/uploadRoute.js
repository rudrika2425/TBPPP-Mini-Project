const multer = require('multer');
const File=require('../models/files');
const router=require('express').Router();
const { v4: uuidv4 } =require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./uploads');   
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname);  
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
        uuid:uuidv4(),
        path: req.file.path,
        size: req.file.size
    });

    await newFile.save();
    res.json({
        message:'File uploaded succesfully',
        file:`${process.env.BASE_URL}/upload/${newFile.uuid}`,

}) 
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:'Internal Server Error'});
    }
  })
  
  router.get('/:uuid',async (req,res)=>{
    try{
    const file=await File.findOne({uuid:req.params.uuid});
    if(!file){
      return res.status(404).json({ error: 'File not found' });
    }
    res.render('download',{filename:file.filename,uuid:file.uuid});
    }
    catch(err){
        res.status(500).json('internal server error')
    }


  })

  


module.exports=router;