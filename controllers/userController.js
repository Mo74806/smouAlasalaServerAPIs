const User = require('./../models/user');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Appointement = require('./../models/appointement');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const users = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('no User matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return next(new AppError('no user matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('no user matched this id', 404));

  Appointement.findOneAndDelete({ id: user.appointements });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUserStats = catchAsync(async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  const user = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    { $project: { month: { $month: '$createdAt' } } },
    { $group: { _id: '$month', total: { $sum: 1 } } }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
