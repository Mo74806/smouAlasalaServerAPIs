const express = require('express');
const projectController = require('./../controllers/projectController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/updateUnit/:id/:unitId')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    projectController.uploadProjectImages,
    projectController.handleProjectFiles,
    projectController.updateUnit
  );

router
  .route('/removeImage/:id/:fieldName/:imageName')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    projectController.deleteImage
  );

router.route('/increaseParsureDownloads/:id').patch(
  // authController.protect,
  // authController.restrictTo('admin'),
  projectController.increaseParsureDownloads
);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(
    projectController.uploadProjectImages,
    projectController.handleProjectFiles,
    projectController.createProject
  );

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    projectController.uploadProjectImages,
    projectController.handleProjectFiles,
    // projectController.uploadProjectImages1,

    projectController.updateProject
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    projectController.deleteProject
  );

module.exports = router;
