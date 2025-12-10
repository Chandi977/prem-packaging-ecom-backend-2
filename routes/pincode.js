const express = require("express");
const {
  createFreight,
  fetchFreight,
  fetchOneFreight,
  updatePincode,
  getPincode,
  getPincodeById,
  countPincode,
  searchPincode,
} = require("../controller/pincode");
const Router = express.Router();

Router.post("/freight/create", createFreight);
Router.get("/freight/get", fetchFreight);
Router.post("/freight/get/one", fetchOneFreight);
Router.get("/pinCode/get/all", getPincode);
Router.get("/pinCode/count", countPincode);
Router.get("/pinCode/search", searchPincode);
Router.put("/pinCode/update", updatePincode);
Router.get("/pincode/get/:id", getPincodeById);

module.exports = Router;
