module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.gmail.com'),
      port: env('SMTP_PORT', 465),
      auth: {
        user: env('m.khaled201774@gmail.com'),
        pass: env('qazxsw@me$si159487')
      }
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: 'm.khaled201774@gmail.com',
      defaultReplyTo: 'm.khaled201700@gmail.com'
    }
  }
});
