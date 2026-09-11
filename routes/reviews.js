const express= require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedin} = require('../middlewares.js');
const {reviewValidation,isReviewAuthor}= require('../middlewares.js');
const reviewController = require('../controllers/reviews.js');

// post reviews
router.post('/',reviewValidation,isLoggedin, wrapAsync(reviewController.addReview));

// delete review
router.delete('/:reviewId',isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports=router;