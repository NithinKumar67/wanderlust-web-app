const express= require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedin, isOwner, listingValidation} = require('../middlewares.js');
const listingController = require('../controllers/listings.js');
const upload = require('../config.js');

router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(listingValidation,upload.single('image'), wrapAsync(listingController.createNewListing));

//add new listing
router.get('/new',isLoggedin, listingController.renderNewListing);

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(listingValidation,isLoggedin,isOwner,upload.single('image'), wrapAsync(listingController.updateListing))
  .delete(isLoggedin,isOwner, wrapAsync(listingController.destroyListing));

//edit
router.get('/:id/edit', isLoggedin,isOwner, wrapAsync(listingController.renderEditListing));


module.exports = router;