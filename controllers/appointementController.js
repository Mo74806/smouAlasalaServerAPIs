const Appointement = require('./../models/appointement');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllAppointements = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Appointement.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const appointements = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: appointements.length,
    data: {
      appointements
    }
  });
});
exports.getAppointement = catchAsync(async (req, res, next) => {
  const appointement = await Appointement.findById(req.params.id);
  if (!appointement) {
    return next(new AppError('no Appointement matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      appointement
    }
  });
});
exports.createAppointement = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const newAppointement = await Appointement.create({
    ...req.body,
    user: req.user.id
  });
  res.status(201).json({
    status: 'success',
    data: {
      appointement: newAppointement
    }
  });
});
exports.updateAppointement = catchAsync(async (req, res, next) => {
  const appointement = await Appointement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  if (!appointement)
    return next(new AppError('no Appointement matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      appointement
    }
  });
});

exports.setAppointementConfirmed = catchAsync(async (req, res, next) => {
  const appointement = await Appointement.findByIdAndUpdate(
    req.params.id,
    { confirm: true },
    {
      new: true,
      runValidators: true
    }
  );
  if (!appointement)
    return next(new AppError('no Appointement matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      appointement
    }
  });
});

exports.deleteAppointement = catchAsync(async (req, res, next) => {
  const appointement = await Appointement.findByIdAndDelete(req.params.id);
  console.log(appointement);

  if (!appointement)
    return next(new AppError('no appointement matched this id', 404));

  if (req.user.role != 'admin')
    if (req.user.id != appointement.user)
      return next(new AppError('you are not authorized', 302));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getFreeAppointementsInDay = catchAsync(async (req, res, next) => {
  let date = req.params.date;
  let freeHourse = [10, 11, 12, 13, 14];
  var dayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  console.log(dayName[new Date(date).getDay()]);
  var day = dayName[new Date(date).getDay()];
  if (day == 'Friday') {
    res.status(200).json({
      status: 'success',
      data: null
    });
  }

  const appointements = await Appointement.find({
    startDate: { $gte: new Date(date) - 1 }
  });

  let newFreeHourse = appointements.map(item => {
    if (freeHourse.includes(new Date(item.startDate).getHours()))
      return new Date(item.startDate).getHours();
  });

  freeHourse = freeHourse.filter(item => !newFreeHourse.includes(item));

  res.status(200).json({
    status: 'success',
    data: {
      freeHourse
    }
  });
});
