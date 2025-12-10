const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema(
  {
    pincode: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    oda: {
      type: Boolean, 
    },
    upto10: {
      type: Number,
    },
    upto20: {
      type: Number,
    },
    upto30: {
      type: Number,
    },
    above30: {
      type: Number,
    },
    b2cZone: {
      type: String,
    },
    b2bZone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pincode", pincodeSchema);