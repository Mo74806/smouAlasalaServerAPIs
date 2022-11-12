const mongoose = require('mongoose');
const slugify = require('slugify');
const AppError = require('../utils/appError');
// const validator = require('validator');

const appointementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: 'user'
    },
    startDate: { type: String, unique: true },
    endDate: { type: String }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

appointementSchema.pre('save', function(next) {
  var dayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  var day = dayName[new Date(this.startDate).getDay()];
  if (day == 'Friday') {
    next(new AppError('please select free date', 500));
  }
  let hour = new Date(this.startDate).getHours();
  console.log(hour);
  console.log(hour >= 10 && hour <= 14);
  if (!(hour >= 10 && hour <= 14)) {
    next(new AppError('please select free hours', 500));
  }
  var fullDate = new Date(this.startDate);
  fullDate.setMinutes(0, 0, 0);
  this.startDate = fullDate;
  console.log(day);
  next();
});

const Appointement = mongoose.model('appointement', appointementSchema);

module.exports = Appointement;
