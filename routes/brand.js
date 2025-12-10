const express = require("express");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  searchBrand,
  countBrands,
} = require("../controller/brand");

const router = express.Router();

router.post("/brand/create", createBrand);
router.get("/brand/get", getBrands);
router.get("/brand/get/:id", getBrand);
router.put("/brand/update", updateBrand);
router.post("/brand/delete", deleteBrand);
router.get("/brand/all", getAllBrands);
router.get("/brand/search", searchBrand);
router.get("/brand/count", countBrands);

module.exports = router;
