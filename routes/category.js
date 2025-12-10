const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  allCategories,
  searchCategories,
  countCategories,
} = require("../controller/category");
const router = express.Router();

router.post("/category/create", createCategory);
router.get("/category/get", getCategories);
router.get("/category/get/:id", getCategory);
router.put("/category/update", updateCategory);
router.post("/category/delete", deleteCategory);
router.get("/category/all", allCategories);
router.get("/category/search", searchCategories);
router.get("/category/count", countCategories);

module.exports = router;
