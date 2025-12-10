const express = require("express");
const {
    createSubscription_order
} = require("../controller/subscription_order");

const router = express.Router();

router.post("/subscription-order", createSubscription_order);
// router.get("/deal/get", getAllDeals);


module.exports = router;