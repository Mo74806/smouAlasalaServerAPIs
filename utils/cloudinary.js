const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
cloudinary.config({
  cloud_name: 'dkkjpuvma',
  api_key: pass,
  api_secret:secret
});
module.exports = { cloudinary };
