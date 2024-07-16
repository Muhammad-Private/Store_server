const { mailOptions, transporter } = require('../mail/Mailconfig');



const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  

  
  const sendEmailCode = (email, randomCode) => {
    const MailOptions = {
      ...mailOptions,
      to: email,
      text: `Your verification code is: ${randomCode}`,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(MailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };
  

  module.exports={
    generateRandomCode,
sendEmailCode
  }