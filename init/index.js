require("dotenv").config({
    path: "../.env"
});
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const db_url = process.env.MONGODB_URL;


async function main() {
  console.log(db_url);
  await mongoose.connect(db_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6aa43b2ef34757fbb34fa568",
    geometry: {
      type: "Point",
      coordinates: [70.8022, 22.3039]
    }
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

main()
  .then(async () => {
    console.log("connected to DB");
    await initDB();
  })
  .catch((err) => {
    console.log(err);
  });



