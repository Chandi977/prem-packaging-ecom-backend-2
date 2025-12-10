const express = require("express");
const {
  createCustomer, getCustomerData ,countCustomer
} = require("../controller/customer");

const router = express.Router();

router.post("/customer/create", createCustomer);
router.get("/customer/get", getCustomerData);
router.get("/customer/count", countCustomer);



module.exports = router;