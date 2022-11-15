const Project = require('./../models/project');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProjectImages = upload.fields([
  { name: 'imageCover', maxCount: 10 },
  { name: 'imageService', maxCount: 15 },
  {
    name: 'unitCover',
    maxCount: 10
  },
  { name: 'imagePlan', maxCount: 15 }
]);

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    req.body.imageCover = [];
    await Promise.all(
      req.files.imageCover.map(async (file, i) => {
        const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(700, 450)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);

        req.body.imageCover.push(filename);
      })
    );
  }
  // 2) Images
  if (req.files.imageService) {
    req.body.imageService = [];
    await Promise.all(
      req.files.imageService.map(async (file, i) => {
        const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(700, 450)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);
        req.body.imageService.push(filename);
      })
    );
  }
  if (req.files.imagePlan) {
    req.body.imagePlan = [];
    await Promise.all(
      req.files.imagePlan.map(async (file, i) => {
        const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(700, 450)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);

        req.body.imagePlan.push(filename);
      })
    );
  }
  //3)housingUnitCoverImage
  if (req.files.unitCover) {
    req.body.unitsCover = [];
    await Promise.all(
      req.files.unitCover.map(async (file, i) => {
        const filename = `${i}-unitCover-${req.params.id}-${Date.now()}-${i +
          1}.jpeg`;

        await sharp(file.buffer)
          .resize(700, 450)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);

        req.body.unitsCover.push(filename);
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

exports.createProject = catchAsync(async (req, res, next) => {
  let units;
  units = req.body.unitsCover.map((item, index) => {
    return {
      name: req.body.unitName[index],
      description: req.body.unitDescription[index],
      imageCover: item
    };
  });

  console.log('**************************');
  console.log(units);
  // let images, images1;
  // for (let i = 0; i < req.body.imageCover.length; i++) {
  //   images = imagesOfUnits.filter(item => {
  //     if (item.index == i) {
  //       units[i].images.push(item.image);
  //     }
  //   });
  // }

  const newProject = await Project.create({
    ...req.body,
    housingUnits: units
  });
  console.log(newProject);
  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  let units = [];

  const project1 = await Project.findById(req.params.id);

  // {
  //   units = project1.housingUnits.map((item, index) => {
  //     // if (index.includes(req.body.edit))
  //     if (index == 1) {
  //       return {
  //         imageCover: req.body.unitCover
  //       };
  //     } else {
  //       return null;
  //     }
  //   });
  // }

  // {
  //   units = project1.housingUnits.map((item, index) => {
  //     return {
  //       name: req.body.unitName[index]
  //     };
  //   });
  // }

  // {
  //   units = project1.housingUnits.map((item, index) => {
  //     return {
  //       description: req.body.unitDescription[index]
  //     };
  //   });
  // }

  if (req.body.imageCover) {
    req.body.imageCover = [...project1.imageCover, ...req.body.imageCover];
  }
  if (req.body.imageService) {
    req.body.imageService = [
      ...project1.imageService,
      ...req.body.imageService
    ];
  }
  if (req.body.imagePlan) {
    req.body.imagePlan = [...project1.imagePlan, ...req.body.imagePlan];
  }

  console.log(req);
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

  if (!project) return next(new AppError('no project matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.updateUnit = catchAsync(async (req, res, next) => {
  let units;

  const project1 = await Project.findById(req.params.id);

  if (!project1) return next(new AppError('no project matched this id', 404));
  let mergeUnits = [...project1.housingUnits];
  if (req.body.unitCover) {
    units = project1.housingUnits.map((item, index) => {
      if (item.id == req.params.unitId) {
        mergeUnits[index].imageCover = req.body.unitCover;

        return {
          imageCover: req.body.unitCover
        };
      } else {
        mergeUnits[index].imageCover = item.imageCover;

        return item;
      }
    });
  }

  if (req.body.unitName) {
    units = project1.housingUnits.map((item, index) => {
      if (item.id == req.params.unitId) {
        mergeUnits[index].name = req.body.unitName;

        return {
          name: req.body.unitName
        };
      } else {
        mergeUnits[index].name = item.name;
        return item;
      }
    });
  }

  if (req.body.unitDescription) {
    units = project1.housingUnits.map((item, index) => {
      if (item.id == req.params.unitId) {
        mergeUnits[index].description = req.body.unitDescription;

        return {
          description: req.body.unitDescription
        };
      } else {
        mergeUnits[index].description = item.description;

        return item;
      }
    });
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,

    { ...project1, housingUnits: [...units] },
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
