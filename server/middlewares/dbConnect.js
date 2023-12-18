const mongoose = require("mongoose");
const { DB_URL } = require("../config.js");

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`MongoDB connected successfully in \n\t{ DB_URL::${DB_URL} }`);
  } catch (err) {
    console.log(`Error connecting to MongoDB::${err}`);
  }
};

module.exports = connectToDB;
