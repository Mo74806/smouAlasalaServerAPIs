const mongoose = require('mongoose');
const slugify = require('slugify');
const AppError = require('../utils/appError');
// const validator = require('validator');

const appointementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: [true, 'you already have an appointement'],
      ref: 'user'
    },
    startDate: {
      type: String,
      unique: true,
      require: [true, 'please Select appointement Date']
    },
    endDate: { type: String },
    confirm: { type: Boolean, default: false }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//pre save middleware to check if the user chooce
//valid day and valid time and free appointement
appointementSchema.pre('save', function(next) {
  if (new Date(this.startDate).getTime() < Date.now()) {
    next(new AppError('please select upcommig days', 500));
  }

  var dayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  var day = dayName[new Date(this.startDate)];
  if (day == 'Friday') {
    next(new AppError('please select free date', 500));
  }
  let hour = new Date(this.startDate).getHours();
  if (!(hour >= 10 && hour <= 14)) {
    next(new AppError('please select free hours', 500));
  }
  var fullDate = new Date(this.startDate);
  fullDate.setMinutes(0, 0, 0);
  this.startDate.day = fullDate.getDay;
  this.startDate.month = fullDate.getMonth;
  this.startDate.year = fullDate.getDay;
  next();
});

const Appointement = mongoose.model('appointement', appointementSchema);

module.exports = Appointement;
