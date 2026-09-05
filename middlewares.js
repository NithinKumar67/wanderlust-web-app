const Listing = require("./models/listing");
const {listingSchema}= require('./schemaValidation');
const {reviewSchema}= require('./schemaValidation');
const ExpressError = require('./utils/ExpressError');
const {userSchema}= require('./schemaValidation');
const Review = require('./models/review');


module.exports.isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'you must me loggined!');
        return res.redirect('/login');
    }
    next();
}
module.exports.urlredirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.curruser || !listing.owner._id.equals(res.locals.curruser._id)){
        req.flash('error', 'you dont have permission to make changes');
        return res.redirect('/listings');
    }
    next();
}

//Listing schemavalidation
module.exports.listingValidation= (req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else{
        next();
    }
}

// review schemavalidation
module.exports.reviewValidation = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else{
        next();
    }
};

// user schemavalidation
module.exports.userValidation = (req, res, next) => {

    const { error } = userSchema.validate(req.body);
    if (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.curruser || !review.author._id.equals(res.locals.curruser._id)) {
        req.flash('error', 'You are not the author of this review');
        return res.redirect(`/listings/${id}`);
    }

    next();
};