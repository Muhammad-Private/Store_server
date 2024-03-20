
var nodemailer = require('nodemailer');
var mailOptions = {
    from: ``,
    to: ``,
    subject: 'Forgot Password - Verification Code ',
    text: ``,
  };

  


  var transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    host:`smtp.gmail.com`,
    service: 'gmail',
    auth: {
      user: 'aboakfe97@gmail.com',
      pass: 'zubc ohnh sghn btfb',
    },
  });

  module.exports={mailOptions,transporter}