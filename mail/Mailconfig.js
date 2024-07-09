
var nodemailer = require('nodemailer');
require('dotenv').config();
var mailOptions = {
    from: ``,
    to: ``,
    subject: 'Forgot Password - Verification Code ',
    text: ``,
  };

  


  var transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host:`smtp.gmail.com`,
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  module.exports={mailOptions,transporter}