const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  allProducts,
  searchProduct,
  searchMainProducts,
  countProducts,
  filterProducts,
  uploadImage,
  getImage,
  SingleProduct,
  filterBoppProducts,
  filterPolyProducts,
  filterLabelProducts,
  SingleProductWithImage,
} = require("../controller/product");
const router = express.Router();

router.post("/product/create", createProduct);
router.get("/product/get", getProducts);
router.get("/product/get/id/:id", getProductById);
router.get("/product/get/:slug", getProduct);
router.put("/product/update", updateProduct);
router.post("/product/delete", deleteProduct);
router.get("/product/all", allProducts);
router.get("/product/search", searchProduct);
router.post("/product/main/search", searchMainProducts);
router.get("/product/count", countProducts);
router.post("/product/filter", filterProducts);
router.post("/bopp/filter", filterBoppProducts);
router.post("/poly/filter", filterPolyProducts);
router.post("/label/filter", filterLabelProducts);
router.post("/uploadImage", uploadImage);
router.get("/getImage", getImage);
router.get("/product/single/:id", SingleProduct);
router.get("/product/image/single/:id", SingleProductWithImage);

// router.post('/upload-csv', upload.single('csv'), productController.uploadCSV);

module.exports = router;
