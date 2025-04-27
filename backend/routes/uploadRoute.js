const express = require('express');
const {
  upload,
  uploadFile,
  getFiles,
  sendEmail,
  downloadFilePage,
} = require('../controllers/uploadController');
const { authmiddleware } = require('../middlewares/authmiddleware');

const router = express.Router();

 
router.post('/file', authmiddleware, upload.single('file'), uploadFile);

 
router.get('/getfiles', authmiddleware, getFiles);
 
router.post('/sendemail', authmiddleware, sendEmail);
 
router.get('/:uuid', downloadFilePage);

module.exports = router;
