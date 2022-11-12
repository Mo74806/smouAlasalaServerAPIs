const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const unitSchema = new mongoose.Schema(
  { name: String, description: String, imageCover: String, images: [String] },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Unit = mongoose.model('Uint', unitSchema);
module.exports = Unit;
