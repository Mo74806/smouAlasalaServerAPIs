const nodemailer = require('nodemailer');

const sendEmail = async options => {
  var transport = nodemailer.createTransport({
    // host: 'smtp.mailtrap.io',
    // port: 25,
    // auth: {
    //   user: 'b8545adabb298f',
    //   pass: '5c5205fe568cfd'
    // }
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'm.khaled201774@gmail.com',
      pass: 'zvrqsdnvvgdpssag'
    }
  });

  const mailOption = {
    // from: 'mostafa khaled<hell@smou.io>',
    // to: options.email,
    // subject: options.subject,
    // text: options.message
    from: 'm.khaled201774@gmail.com',
    to: 'm.khaled201700@gmail.com',
    subject: options.subject,
    text: options.message
  };
  transport.sendMail(mailOption, function(err, data) {
    if (err) {
      console.log('Error Occurs');
      console.log(err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

module.exports = sendEmail;
