const Project = require('./../models/project');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(req.files);

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
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
  {
    name: 'unitCover',
    maxCount: 100
  },
  { name: 'unitImages', maxCount: 200 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  console.log(req.files.imageCover);

  // if (
  //   !req.files.imageCover ||
  //   !req.files.images ||
  //   !req.files.housingUnitsimageCover ||
  //   !req.files.housingUnitsimages
  // )
  //   return next();

  // 1) Cover image
  console.log(req.body);
  req.body.imageCover = `projects-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(700, 450)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/projects/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `project-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(700, 450)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/projects/${filename}`);

      req.body.images.push(filename);
    })
  );
  // //3)housingUnitCoverImage

  req.body.housingUnitsimageCover = `projects-${
    req.params.id
  }-${Date.now()}-cover.jpeg`;
  3;
  req.body.unitsCover = [];
  // console.log(unitCover);
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

  await sharp(req.files.housingUnitsimageCover[0][0].buffer)
    .resize(700, 450)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/projects/housingUnits/${req.body.imageCover}`);
  console.log('-----------------');

  console.log(req.files.housingUnitsimages);
  req.body.housingUnitsimages = [];
  await Promise.all(
    req.files.unitImages.map(async (file, i) => {
      const filename = `${i}-project-${req.params.id}-${Date.now()}.jpeg`;
      await sharp(file.buffer)
        .resize(700, 450)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/projects/housingUnits/${filename}`);
      req.body.housingUnitsimages.push(filename);
    })
  );
  // console.log('ggyyyyyyyyyyyyy');
  // console.log(req.body.housingUnitsimages);
  next();
});

// exports.aliasTopProjects = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

exports.getAllProjects = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const projects = await features.query;
  const readStream = fs.createReadStream(`/${projects[0].imageCover}`);

  //   res.send(`
  // <link rel="stylesheet" type="text/css"
  //   href="css/style.css">
  // <h1>Welome</h1>
  // <img
  // src="/images/misc/${projects[0].imageCover}"
  // style="height:300px;"/>
  // <p>some text</p>`);
  // });
  // SEND RESPONSE
  // res.sendFile(
  //   path.join(__dirname, 'public', `img/projects${projects[0].imageCover}`)
  // );

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('no Project matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let imagesOfUnits = [];
  let prev = 0;
  JSON.parse(req.body.unitImagesNum).map((num, index) => {
    console.log(index);
    for (let i = prev; i < prev + num; i++) {
      imagesOfUnits.push({ image: req.body.housingUnitsimages[i], index });
    }
    prev = num;
  });
  console.log(imagesOfUnits);
  let units = req.body.unitsCover.map((item, index) => {
    return {
      name: index,
      imageCover: item,
      images: []
    };
  });
  let images, images1;
  for (let i = 0; i < req.body.imageCover.length; i++) {
    images = imagesOfUnits.filter(item => {
      if (item.index == i) {
        units[i].images.push(item.image);
      }
    });
  }

  console.log('-----------------------------');
  console.log(req.files.unitImages);
  const newProject = await Project.create({
    ...req.body
    // housingUnits: units
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
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!project) return next(new AppError('no project matched this id', 404));

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
