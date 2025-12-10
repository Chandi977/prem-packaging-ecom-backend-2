const express = require("express");
const {
signup,
  signIn,
  Allusers,
  userStats,
  searchUsers,
  CountUsers,
  deleteUser,
  specificuser,
  editUser,
  changePassword,
  totalUsers,
  AllAdminRoles,
  totalAdmin,
  CountAdmin,
  verifyEmail,
  updateField,
  reVerifyEmail,
  updateCouponCode,
} = require("../controller/auth");
const Router = express.Router();

Router.post("/signup", signup);
Router.post("/signin", signIn);
Router.get("/allCustomers", Allusers);
Router.get("/userStats", userStats);
Router.get("/searchusers", searchUsers);
Router.get("/countUsers", CountUsers);
Router.post("/deleteUser", deleteUser);
Router.get("/getuser/:id", specificuser);
Router.post("/edituser", editUser);
Router.post("/adminPass", changePassword);
Router.get("/totalUsers", totalUsers);
Router.get("/all/admin", AllAdminRoles);
Router.get("/all/admin/list", totalAdmin);
Router.get("/count/admin", CountAdmin);
Router.post("/verify/email", verifyEmail);
Router.put("/update/verified", updateField);
Router.post("/re/verify/email", reVerifyEmail);
Router.post("/add/coupon", updateCouponCode);



module.exports = Router;
