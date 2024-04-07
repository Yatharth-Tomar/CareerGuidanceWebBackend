const nodemailer = require('nodemailer');
const sendEmail = async (email, subject, message) => {
  console.log(email, subject, message);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, //true for 465, flase for other ports
    secureConnection: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'yatharth_tomar@srmap.edu.in',
      pass: 'cind buzj vaqc msfr',
    },
    tls: {
      rejectUnAuthorized: true,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'yatharth_tomar@srmap.edu.in', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
};
module.exports = sendEmail;
