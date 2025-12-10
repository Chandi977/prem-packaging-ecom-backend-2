const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  searchSubCategory,
  countSubCategories,
  getAllSubCategories,
} = require("../controller/subcategory");

const router = express.Router();

router.post("/subcategory/create", createSubCategory);
router.get("/subcategory/get", getSubCategories);
router.get("/subcategory/get/:id", getSubCategory);
router.put("/subcategory/update", updateSubCategory);
router.post("/subcategory/delete", deleteSubCategory);
router.get("/subcategory/all", getAllSubCategories);
router.get("/subcategory/search", searchSubCategory);
router.get("/subcategory/count", countSubCategories);

module.exports = router;
