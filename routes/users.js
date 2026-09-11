const express= require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({mergeParams:true});
const passport = require('passport');
const {urlredirect, userValidation}= require('../middlewares.js');
const userController = require('../controllers/users.js');

router
  .route('/signup')
  .get(wrapAsync(userController.renderSignupPage))
  .post(userValidation,wrapAsync(userController.addUser));

router
  .route('/login')
  .get(wrapAsync(userController.renderLoginPage))
  .post(urlredirect,
    passport.authenticate('local', {failureRedirect: '/login',failureFlash:true}),
    wrapAsync(userController.login))

router.get('/logout',wrapAsync(userController.logout));

module.exports = router;