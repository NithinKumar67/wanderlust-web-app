const express= require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {listingSchema}= require('../schemaValidation');
const user = require('../models/user');
const {isLoggedin, isOwner, listingValidation} = require('../middlewares.js');



//listings route
router.get('/',wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render('listings.ejs',{allListings});
}));

//add new listing
router.get('/new',isLoggedin, (req, res) => {
    res.render('listings/new.ejs');
});


//add new to db
router.post('/',listingValidation, wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success','New listing created!');
    res.redirect('/listings');
}));

//show listing
router.get('/:id',wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');
    if(!listing){
        req.flash('error','the listing you requested doesnot exist');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
}));

//edit
router.get('/:id/edit', isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','the listing you requested doesnot exist');
        return res.redirect('/listings');
    }

    res.render('listings/edit.ejs', { listing });
}));

//update
router.put('/:id',listingValidation,isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, req.body);
    req.flash('success','listing updated!');

    res.redirect(`/listings/${id}`);
}));

//delete listing
router.delete('/:id',isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success','listing deleted!');

    console.log("Deleted listing:", deletedListing);

    res.redirect('/listings');
}));

module.exports = router;