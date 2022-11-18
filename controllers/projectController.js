const Project = require('./../models/project');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   // if (file.mimetype.startsWith('image')) {
//   if (true) {
//     // if (true) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

const upload = multer(
  // {
  // storage: multerStorage,
  { dest: 'public/img/projects/' }
  // fileFilter: multerFilter
  // }
);

exports.uploadProjectImages = upload.fields([
  { name: 'imageCover', maxCount: 10 },
  { name: 'imageService', maxCount: 15 },
  {
    name: 'unitCover',
    maxCount: 10
  },
  { name: 'imagePlan', maxCount: 15 },
  { name: 'parsure', maxCount: 1 }
]);

exports.handleProjectFiles = catchAsync(async (req, res, next) => {
  //1)imageCover
  if (req.files.imageCover) {
    req.body.imageCover = [];
    await Promise.all(
      req.files.imageCover.map((file, i) => {
        req.body.imageCover.push(
          `${file.filename}.${file.originalname.split('.')[1]}`
        );
      })
    );
  }

  // 2) imageServices
  if (req.files.imageService) {
    req.body.imageService = [];
    await Promise.all(
      req.files.imageService.map((file, i) => {
        req.body.imageService.push(
          `${file.filename}.${file.originalname.split('.')[1]}`
        );
      })
    );
  }
  //3)imagePlan
  if (req.files.imagePlan) {
    req.body.imagePlan = [];
    await Promise.all(
      req.files.imagePlan.map(async (file, i) => {
        req.body.imagePlan.push(
          `${file.filename}.${file.originalname.split('.')[1]}`
        );
      })
    );
  }
  //4)housingUnitCoverImage
  if (req.files.unitCover) {
    req.body.unitsCover = [];
    await Promise.all(
      req.files.unitCover.map(async (file, i) => {
        req.body.unitsCover.push(
          `${file.filename}.${file.originalname.split('.')[1]}`
        );
      })
    );
  }

  // 5) parsure
  if (req.files.parsure) {
    req.body.imageService = [];
    await Promise.all(
      req.files.parsure.map((file, i) => {
        req.body.parsure.push(
          `${file.filename}.${file.originalname.split('.')[1]}`
        );
      })
    );
  }

  next();
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const projects = await features.query;

  res.status(200).json({
    status: 'success',
    results: projects.length,
    projects
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('no Project matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    project
  });
});

// exports.upload1 = multer({ dest: 'public/files' });

const multerStorage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `files/admin-${file.fieldname}.${ext}`);
  }
});
const multerFilter1 = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF File!!'), false);
  }
};
exports.upload1 = multer({
  dest: 'public/files',
  fileFilter: multerFilter1
});

exports.createProject = catchAsync(async (req, res, next) => {
  let units = req.body.unitsCover.map((item, index) => {
    return {
      name: req.body.unitName[index],
      description: req.body.unitDescription[index],
      imageCover: item
    };
  });

  const newProject = await Project.create({
    ...req.body,
    housingUnits: units
  });

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  //get the project by id
  const project1 = await Project.findById(req.params.id);
  //if no project
  if (!project1) return next(new AppError('no project matched this id', 404));
  //if there New imagesCover add them to the old
  if (req.body.imageCover) {
    req.body.imageCover = [...project1.imageCover, ...req.body.imageCover];
  }
  //if there New imagesServices add them to the old
  if (req.body.imageService) {
    req.body.imageService = [
      ...project1.imageService,
      ...req.body.imageService
    ];
  }
  //if there New imagesPlan add them to the old
  if (req.body.imagePlan) {
    req.body.imagePlan = [...project1.imagePlan, ...req.body.imagePlan];
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.updateUnit = catchAsync(async (req, res, next) => {
  //get the project by id
  const project1 = await Project.findById(req.params.id);
  //if no project
  if (!project1) return next(new AppError('no project matched this id', 404));
  //catch the units array
  let mergeUnits = [...project1.housingUnits];
  ///////////handle the changes in units////////////////
  //if there change in the imageCover
  if (req.body.unitsCover) {
    project1.housingUnits.map((item, index) =>
      item.id == req.params.unitId
        ? (mergeUnits[index].imageCover = req.body.unitsCover[0])
        : (mergeUnits[index].imageCover = item.imageCover)
    );
  }
  //if there change in the unitName
  if (req.body.unitName) {
    project1.housingUnits.map((item, index) =>
      item.id == req.params.unitId
        ? (mergeUnits[index].name = req.body.unitName)
        : (mergeUnits[index].name = item.name)
    );
  }
  //if there change in the unitDescription
  if (req.body.unitDescription) {
    project1.housingUnits.map((item, index) =>
      item.id == req.params.unitId
        ? (mergeUnits[index].description = req.body.unitDescription)
        : (mergeUnits[index].description = item.description)
    );
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { ...project1, housingUnits: [...mergeUnits] },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  //get the project by id
  const project1 = await Project.findById(req.params.id);

  let images = project1[req.params.fieldName];
  let returnImages = images.filter(item => {
    if (item != req.params.imageName) return item;
  });
  console.log(returnImages);
  project1[req.params.fieldName] = [...returnImages];
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { ...project1 },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return next(new AppError('no project matched this id', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
