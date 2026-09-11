const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Wanderlust_DEV",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const upload = multer({ storage });

module.exports = upload;