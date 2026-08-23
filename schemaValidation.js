const Joi = require("joi");

const listingSchema = Joi.object({
    title: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    image: Joi.object({
        url: Joi.string().allow(""),
        filename: Joi.string().allow("")
    }).allow(null),

    price: Joi.number()
        .required()
        .min(0),

    location: Joi.string()
        .required(),

    country: Joi.string()
        .required()
});

module.exports= listingSchema;