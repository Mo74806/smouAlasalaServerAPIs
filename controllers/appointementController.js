const Appointement = require('./../models/appointement');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/user');

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
  app.use('/static', express.static(path.join(__dirname, 'public')));

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
  const newAppointement = await Appointement.create({
    ...req.body,
    user: req.user.id
  });

  //put the appointement ID at the user data
  const user = await User.findByIdAndUpdate(req.user.id, {
    appointements: newAppointement.id
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
  //change the status of the appointement by the admin
  //confirm the appointement
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
  const appointement = await Appointement.findById(req.params.id);
  if (!appointement)
    return next(new AppError('no appointement matched this id', 404));
  if (req.user.role != 'admin' || req.user.id != appointement.user)
    return next(new AppError('you are not authorized', 302));
  //delete the reference from the user data
  const user = await User.findByIdAndUpdate(appointement.user, {
    appointements: null
  });

  await Appointement.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
//return the avaliable free apoointements in the day
exports.getFreeAppointementsInDay = catchAsync(async (req, res, next) => {
  let date = req.params.date;
  if (Date.now() - 24 * 60 * 60 * 1000 > new Date(date).getTime()) {
    return next(new AppError('please select a newer date time', 404));
  }

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
  var day = dayName[new Date(date).getDay()];
  if (day == 'Friday') {
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'this is a dayoff '
    });
  }

  const appointements = await Appointement.find({});
  day = new Date(date).getDate();
  let month = new Date(date).getMonth() + 1;
  let year = new Date(date).getFullYear();
  let newFreeHourse = appointements.map(item => {
    if (
      new Date(item.startDate).getDate() == day &&
      new Date(item.startDate).getMonth() + 1 == month &&
      new Date(item.startDate).getFullYear() == year
    )
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

exports.verfiyLastAppointement = catchAsync(async (req, res, next) => {
  const appointement = await Appointement.findOne({ use: req.user._id });
  if (!appointement) return next();
  if (new Date(appointement.startDate).getTime() < Date.now()) {
    const user = await User.findByIdAndUpdate(req.user._id, {
      appointements: null
    });
    await Appointement.findByIdAndDelete(appointement.id);
  }

  next();
});
