const express = require("express");
const { createNotify , getNotify , countNotifies} = require("../controller/notify");

const router = express.Router();

router.post("/notify/create", createNotify);
router.get("/notify/get", getNotify);
router.get("/notify/count", countNotifies);


module.exports = router;
