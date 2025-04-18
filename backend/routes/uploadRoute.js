const multer = require('multer');
const File=require('../models/files');
const router=require('express').Router();
const { v4: uuidv4 } =require('uuid');
const {authmiddleware}=require('../middlewares/authmiddleware')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary=require('../cloudinaryConfig')
const cron = require('node-cron');


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
   
    const uploadedAt = new Date();
    const expirationDate = new Date(uploadedAt.getTime() + 24* 24 * 60 * 1000);
   const fileuuid=uuidv4();
    const newFile = new File({
        filename: req.file.originalname,
        uuid:fileuuid,
        path: req.file.path,
        url:`${process.env.BASE_URL}/upload/${fileuuid}`,
        size: req.file.size,
        user:req.user.userId,
        expirationDate: expirationDate,
       
    });
    await newFile.save();
    res.json({
        message:'File uploaded succesfully',
        file:newFile.url,

}) 
    }
    catch(err){
        console.log("error is:"+err);
        return res.status(500).json({error:'Internal Server Error'});
    }
  })

  router.get("/protected", authmiddleware, (req, res) => {
    console.log("in protected route");
    res.status(200).json({
      authenticated:true,
      user: req.user,
    });
  });
 

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
 
  cron.schedule('* * * * *', async () => {
    try {
      const now =new Date();
      const expiredFiles = await File.find({ expirationDate:{$lt:now}});

      for (const file of expiredFiles) {
        const publicId = getCloudinaryPublicId(file.path);
   
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
        await File.deleteOne({ _id: file._id });
        console.log(`Deleted expired file: ${file.filename}`);
      }
    } catch (err) {
      console.error('Error deleting expired files:', err);
    }
  });

  function getCloudinaryPublicId(url) {
    try {
      const parts = url.split('/');
      const rawFilename = parts[parts.length - 1].split('.')[0];
      const folder = parts[parts.length - 2]; 
      return `${folder}/${rawFilename}`;
    } catch {
      return null;
    }
  }
  


module.exports=router;