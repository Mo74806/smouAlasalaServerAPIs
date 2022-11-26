const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/userStats')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUserStats
  );
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(userController.createUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );
router
  .route('/role/isUserAdmin')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    authController.returnAdminData
  );

module.exports = router;
