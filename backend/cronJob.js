const cron = require('node-cron');
const File = require('./models/files');

const runCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      const expiredFiles = await File.find({ expirationDate: { $lt: now } });

      if (expiredFiles.length > 0) {
        for (const file of expiredFiles) {
          await File.deleteOne({ uuid: file.uuid });

        }
      }
    } catch (err) {
      console.error('Error cleaning expired files:', err);
    }
  });
};

module.exports = runCronJob;