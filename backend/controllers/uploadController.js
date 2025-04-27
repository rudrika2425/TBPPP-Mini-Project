const multer = require('multer');
const File = require('../models/files');
const { v4: uuidv4 } = require('uuid');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinaryConfig');
const Sendmail = require('../controllers/email');
const cron = require('node-cron');

 
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'inshare',
    resource_type: 'raw',
    access_mode: "public",
    public_id: (req, file) => `${file.originalname}`,
  },
});

const upload = multer({ storage });

 
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedAt = new Date();
    const expirationDate = new Date(uploadedAt.getTime() + 24 * 60 * 60 * 1000); 
    const fileuuid = uuidv4();

    const newFile = new File({
      filename: req.file.originalname,
      uuid: fileuuid,
      path: req.file.path,
      url: `${process.env.BASE_URL}/upload/${fileuuid}`,
      size: req.file.size,
      user: req.user.userId,
      expirationDate,
    });

    await newFile.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      file: newFile.url,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

 
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.userId });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found for this user' });
    }

    res.status(200).json({
      message: 'Files fetched successfully',
      files,
    });
  } catch (err) {
    console.error("Get Files Error:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

 
const sendEmail = async (req, res) => {
  try {
    const { uuid, emailTo } = req.body;
    const emailFrom = "inshare59@gmail.com";

    if (!uuid || !emailTo) {
      return res.status(422).send({ error: 'All fields are required' });
    }

    const file = await File.findOne({ uuid });

    if (!file) {
      return res.status(404).send({ error: 'File not found' });
    }

    await Sendmail(
      emailTo,
      'Inshare File Sharing',
      `${emailFrom} shared a file with you`,
      require('../controllers/emailTemplate')({
        emailFrom,
        downloadLink: `${process.env.BASE_URL}/upload/${file.uuid}`,
        size: parseInt(file.size / 1000) + ' KB',
      })
    );

    return res.send({ success: true });
  } catch (err) {
    console.error("Send Email Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

 
const downloadFilePage = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.render('download', {
      filename: file.filename,
      uuid: file.uuid,
      path: file.path,
      fileSize: file.size,
    });
  } catch (err) {
    console.error("Download Page Error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

 
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const expiredFiles = await File.find({ expirationDate: { $lt: now } });

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


const getCloudinaryPublicId = (url) => {
  try {
    const parts = url.split('/');
    const rawFilename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${rawFilename}`;
  } catch {
    return null;
  }
};

module.exports = {
  upload,
  uploadFile,
  getFiles,
  sendEmail,
  downloadFilePage,
};
