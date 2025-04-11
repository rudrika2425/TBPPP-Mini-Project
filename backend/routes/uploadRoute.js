const multer = require('multer');
const File=require('../models/files');
const router=require('express').Router();
const { v4: uuidv4 } =require('uuid');
const {authmiddleware}=require('../middlewares/authmiddleware')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary=require('../cloudinaryConfig')
const User=require('../models/userModel')

const Sendmail=require('../controllers/email')

  const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
      folder:'inshare',
      resource_type:'raw',
      access_mode:"public",
      public_id: (req, file) => `${file.originalname}`
    }
  })

  const upload=multer({storage});

  router.post('/file',authmiddleware,upload.single('file'),async (req,res)=>{
    try{
    if(!req.file){
        return res.status(400).json({error:'No file uploaded'});
    }
   
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); 
    const newFile = new File({
        filename: req.file.originalname,
        uuid:uuidv4(),
        path: req.file.path,
        size: req.file.size,
        user:req.user.userId,
        expirationDate: expirationDate,
    });

    await newFile.save();
    res.json({
        message:'File uploaded succesfully',
        file:`${process.env.BASE_URL}/upload/${newFile.uuid}`,

}) 
    }
    catch(err){
        console.log("error is:"+err);
        return res.status(500).json({error:'Internal Server Error'});
    }
  })
 

  router.get('/getfiles',authmiddleware,async(req,res)=>{
    console.log(req.user);
    try{
        const files=await File.find({user:req.user.userId});
        if(files.length===0){
          return res.status(404).json({ message: 'No files found for this user' });
        }
     
        res.status(200).json({
          message: 'Files fetched successfully',
          files: files
        });
    }
    catch(err){
      console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
    }
  })

  
  router.post('/sendemail',authmiddleware,async (req,res)=>{
     const {uuid,emailTo}=req.body;
     console.log(req.user);
     const emailFrom="inshare59@gmail.com";
     console.log("emailFrom: "+emailFrom);
     console.log("emailTo: "+emailTo);

     if(!uuid || !emailTo || !emailFrom){
      return res.status(422).send({error:'All fields required'});
     }

     const file=await File.findOne({uuid:uuid});

     if (!file) {
      return res.status(404).send({ error: 'File not found' });
    }

    await Sendmail(
      emailTo,
      'Inshare File sharing',
      `${emailFrom} shared a file with you`,
      require('../controllers/emailTemplate')({
        emailFrom,
        downloadLink: `${process.env.BASE_URL}/upload/${file.uuid}`,
        size: parseInt(file.size / 1000) + ' KB',
      })
    );
    
    return res.send({ success: true });
  })
  

  router.get('/:uuid',async (req,res)=>{
    try{
    const file=await File.findOne({uuid:req.params.uuid});
    if(!file){
      return res.status(404).json({ error: '"uuid:" File not found' });
    }
    console.log(req.params.uuid);
    console.log(file);
    
    res.render('download',{
      filename:file.filename,
      uuid:file.uuid,
      path:file.path,
      fileSize:file.size
    });
    }
    catch(err){
        res.status(500).json('internal server error')
    }
  })
 

module.exports=router;