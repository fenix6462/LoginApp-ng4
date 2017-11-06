var express = require('express');
var router = express.Router();

var authenticationController = require('../controllers/authentication.controller');
var profileController = require('../controllers/profile.controller');

const ROLE_MEMBER = require('../../config/roles').ROLE_MEMBER;
const ROLE_ADMIN = require('../../config/roles').ROLE_ADMIN;

// Auth route
router
  .route('/auth/register')
  .post(authenticationController.register);

router
  .route('/auth/login')
  .post(authenticationController.login);
  
router
  .route('/auth/forgot')
  .post(authenticationController.forgot);
  
router
  .route('/auth/reset/:token')
  .post(authenticationController.reset);

//Api route
router
  .route('/profile')
  .get(authenticationController.requireAuth, profileController.getProfile)
  .put(authenticationController.requireAuth, profileController.updateProfile);

module.exports = router;