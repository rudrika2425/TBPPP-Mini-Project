const cron = require('node-cron');
const File = require('./models/files');
const fs = require('fs');
const path = require('path');


const runCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      const expiredFiles = await File.find({ expirationDate: { $lt: now } });

      if (expiredFiles.length > 0) {
        for (const file of expiredFiles) {
         
          fs.unlink(path.join(__dirname, '..', file.path), async (err) => {
            if (err) {
              console.log(`Error deleting file: ${file.filename}`, err);
            } else {
              
              await File.deleteOne({ uuid: file.uuid });
              console.log(`File ${file.filename} deleted successfully.`);
            }
          });
        }
      }
    } catch (err) {
      console.error('Error cleaning expired files:', err);
    }
  });
};

module.exports = runCronJob; 
