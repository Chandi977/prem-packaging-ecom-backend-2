const express = require("express");
const { forgotPassword , verifyOTP , resetPassword } = require("../controller/password_reset");

const router = express.Router();

router.post("/reset/password/otp", forgotPassword);
router.post("/reset/password/verify/otp", verifyOTP);
router.post("/reset/password/update", resetPassword);



module.exports = router;
