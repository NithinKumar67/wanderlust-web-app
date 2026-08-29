const express= require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const MONGODB_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require('./models/listing');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema, reviewSchema}= require('./schemaValidation');
const Review = require('./models/review');


app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

//Listing schemavalidation
const listingValidation= (req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else{
        next();
    }
}
// review schemavalidation
const reviewValidation = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else{
        next();
    }
};

//connection to db
async function main() {
    await mongoose.connect(MONGODB_URL);
}
main()
    .then(()=> console.log('connection successful'))
    .catch(err => console.log(err));



//server setup
app.listen(3000,()=>{
    console.log('app is listening');
});

//home route
app.get('/',(req,res)=>{
    res.send('working');
});

//listings route
app.get('/listings',wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render('listings.ejs',{allListings});
}));

//add new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});


//add new to db
app.post('/listings',listingValidation, wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect('/listings');
}));

//show listing
app.get('/listings/:id',wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs',{listing});
}));

//edit
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render('listings/edit.ejs', { listing });
}));

//update
app.put('/listings/:id',listingValidation, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, req.body);

    res.redirect(`/listings/${id}`);
}));

//delete listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    console.log("Deleted listing:", deletedListing);

    res.redirect('/listings');
}));

// post reviews

app.post('/listings/:id/reviews',reviewValidation, wrapAsync(async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}))

// delete review

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async (req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

app.all("/{*splat}",(req,res,next)=>{
    let error = new ExpressError(404,'page not found!');
    next(error);
    
})
app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render('listings/error.ejs',{message});

});
