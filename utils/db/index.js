const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI;

exports.DBconnection = () => {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("Database connected successfully.");
    })
    .catch((err) => {
      console.log("error occured in connecting the database.", err);
    });
};
