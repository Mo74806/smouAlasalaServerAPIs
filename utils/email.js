const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '430978b764c6dc',
      pass: '108c79075d33ce'
    }

    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,

    // auth: {
    //   user: 'm.khaled201774@gmail.com',
    //   pass: 'qazxsw@me$si159487'
    // }
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //   type: 'OAuth2',
    //   user: 'm.khaled201774@gmail.com',
    //   accessToken: 'qazxsw@me$si159487'
    // }
  });

  const mailOption = {
    from: 'mostafa khaled <m.khaled201774@gmail.com>',
    to: options.email,
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
