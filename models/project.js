const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A project Must Have  a Name'],
      minlength: [3, 'A project Name must be larger than 3 Charcter']
    },
    videos: { type: [String] },
    description: {
      type: [String],
      // require: [true, 'A project Must Have  a Description'],
      minlength: [20, 'project description is too small']
    },
    imageCover: {
      type: String
      // require: [true, 'A project Must Have  a cover image']
    },
    images: {
      type: [String]
      // require: [true, 'A project Must Have  a images']
    },
    housingUnits: [
      { imageCover: { type: String }, images: [String], name: String }
    ],
    establishDate: {
      type: Date
      // require: [true, 'establishing date is required']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
