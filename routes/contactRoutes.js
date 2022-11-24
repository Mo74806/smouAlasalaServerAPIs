const express = require('express');
const contactController = require('./../controllers/contactController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    contactController.getAllContacts
  )
  .post(contactController.createContact);

router
  .route('/:id')
  .get(contactController.getContact)
  .patch(contactController.updateContact)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    contactController.deleteContact
  );

module.exports = router;
