const mongoose = require('mongoose');
const slugify = require('slugify');
const AppError = require('../utils/appError');
const validator = require('validator');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      minlength: 2
    },
    phone: {
      type: String,
      required: [true, 'Please tell us your Phone!'],
      minlength: 11
    },
    mail: {
      type: String,
      required: [true, 'Please tell us your mail!'],
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    message: {
      type: String,
      required: [true, 'Please tell us your message!'],
      minlength: 5
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
