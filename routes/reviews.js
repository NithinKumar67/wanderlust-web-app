const express= require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const {isLoggedin} = require('../middlewares.js');
const {reviewValidation,isReviewAuthor}= require('../middlewares.js');

// post reviews

router.post('/',reviewValidation,isLoggedin, wrapAsync(async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','New Review Added!');
    res.redirect(`/listings/${listing._id}`)
}))

// delete review

router.delete('/:reviewId',isLoggedin,isReviewAuthor, wrapAsync(async (req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted');

    res.redirect(`/listings/${id}`);
}))

module.exports=router;