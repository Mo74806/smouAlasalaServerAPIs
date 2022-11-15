const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { stringify } = require('querystring');
const catchAsync = require('../utils/catchAsync');
//user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,

    required: [true, 'Please tell us your name!']
  },
  lastName: {
    type: String,
    minlength: 2,

    required: [true, 'Please tell us your name!']
  },
  userName: {
    type: String,
    minlength: 4,

    unique: true,
    lowercase: true,
    required: [true, 'Please tell us your useName!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false //these make it non retunable in quieries
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        // console.log('i am in validator');
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  appointements: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointement'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  PasswordResetExpires: Date
});

//pre save middleware to hash the basword
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//create User Model
const User = mongoose.model('user', userSchema);
module.exports = User;
