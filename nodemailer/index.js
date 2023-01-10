const nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();

async function main(receiver) {

  let testAccount = await nodemailer.createTestAccount();

  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_ID, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  
  let info = await transporter.sendMail({
    from: process.env.EMAIL_ID, 
    to: receiver, 
    subject: "Bookstream", 
    text: "Signed you in successfully!",  
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = main;
