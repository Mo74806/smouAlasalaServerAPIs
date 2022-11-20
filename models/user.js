const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { stringify } = require('querystring');
const catchAsync = require('../utils/catchAsync');
//user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      validate: [validator.isAlpha, 'please enter a valid name'],
      required: [true, 'Please tell us your name!']
    },
    lastName: {
      type: String,
      minlength: 2,
      validate: [validator.isAlpha, 'please enter a valid name'],
      required: [true, 'Please tell us your name!']
    },
    userName: {
      type: String,
      minlength: 3,
      unique: true,
      lowercase: true,
      required: [true, 'Please tell us your userName!']
    },
    phone: {
      type: String,
      validate: [validator.isMobilePhone, 'please enter a valid phone number']
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
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
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
  },
  { timestamps: true }
);

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

//method instance to check if the provide password in login
//is the same as the hashed in database
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//method instance  to check if he user use an old JWT after he change the password
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
//method instance to create a temporary reset token for the forgeten password
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //set the exxpire time for the reset token is 10 MIN after sending to the user
  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//pre save middle ware after edit the password to store when the last time the
//user change the password
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//create User Model
const User = mongoose.model('user', userSchema);
module.exports = User;
