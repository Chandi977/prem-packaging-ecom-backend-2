const express = require("express");
const {
    createCustom_Package,
    getCustomPackageData,
    countCustomPackages
} = require("../controller/custom_packaging");

const router = express.Router();

router.post("/custom-packaging", createCustom_Package);
router.get("/custom/packaging/get", getCustomPackageData);
router.get("/custom/packaging/count",countCustomPackages);



module.exports = router;