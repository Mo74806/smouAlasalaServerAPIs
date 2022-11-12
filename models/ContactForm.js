const mongoose = require('mongoose');
const slugify = require('slugify');
const AppError = require('../utils/appError');
// const validator = require('validator');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    mail: { type: String },
    message: { type: String }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
