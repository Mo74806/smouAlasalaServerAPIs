const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
cloudinary.config({
  cloud_name: 'dkkjpuvma',
  api_key: '973479728989825',
  api_secret: 'Lk142QT16EhmTgHM-o7pEKrc2GQ'
});
module.exports = { cloudinary };
