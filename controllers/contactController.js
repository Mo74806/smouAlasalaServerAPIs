const Contact = require('./../models/ContactForm');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllContacts = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contacts = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts
    }
  });
});
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('no Contact matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
});
exports.createContact = catchAsync(async (req, res, next) => {
  // console.log(req.body);

  const newContact = await Contact.create({ ...req.body });

  console.log(newContact);
  res.status(201).json({
    status: 'success',
    data: {
      contact: newContact
    }
  });
});
exports.updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!contact) return next(new AppError('no contact matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
});
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError('no contact matched this id', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
