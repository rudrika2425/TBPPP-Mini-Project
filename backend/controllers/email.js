const nodemailer=require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  secure:false,
  port:465,
  auth: {
    user:"inshare59@gmail.com",  
    pass:"sttl ugji kwdt rmzk",  
  },
});

const sendEmail = async (emailTo, subject, message,html) => {
  const mailOptions = {
    
    to: emailTo,
    subject: subject,
    text: message,
    html:html
  };
  

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
