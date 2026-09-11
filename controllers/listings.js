const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: map_token});


module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render('listings.ejs',{allListings});
}

module.exports.renderNewListing = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.createNewListing = async (req, res,next) => {

    const result = await geocodingClient.forwardGeocode({
        query: `${req.body.location}, ${req.body.country}`,
        limit: 1
    }).send();
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.secure_url,
        filename: req.file.public_id
    };
    newListing.geometry = result.body.features[0].geometry;
    console.log(newListing.geometry);
    await newListing.save();
    req.flash('success','New listing created!');
    res.redirect('/listings');
}

module.exports.showListing = async (req,res)=>{
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
}

module.exports.renderEditListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','the listing you requested doesnot exist');
        return res.redirect('/listings');
    }

    res.render('listings/edit.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, req.body);

    if(req.file){
        listing.image = {
        url: req.file.secure_url,
        filename: req.file.public_id
        };
        await listing.save();
    }

    req.flash('success','listing updated!');

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success','listing deleted!');

    console.log("Deleted listing:", deletedListing);

    res.redirect('/listings');
}