const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listhing_Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: String,
        url: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model('Listing', listhing_Schema);

module.exports = Listing;