const express = require('express');
const appointementController = require('./../controllers/appointementController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    appointementController.getAllAppointements
  )
  .post(authController.protect, appointementController.createAppointement);

router
  .route('/:id')
  .get(authController.protect, appointementController.getAppointement)
  .patch(authController.protect, appointementController.updateAppointement)
  .delete(authController.protect, appointementController.deleteAppointement);
  .patch(authController.protect, appointementController.setAppointementConfirmed)

router
  .route('/free/:date')
  .get(
    authController.protect,
    appointementController.getFreeAppointementsInDay
  );

module.exports = router;
