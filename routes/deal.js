const express = require("express");
const {
  createDeal,
  getAllDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  allDeals,
  countDeals,
  searchDeals,
} = require("../controller/deal");

const router = express.Router();

router.post("/deal/create", createDeal);
router.get("/deal/get", getAllDeals);
router.get("/deal/get/:id", getDeal);
router.put("/deal/update", updateDeal);
router.post("/deal/delete", deleteDeal);
router.get("/deal/all", allDeals);
router.get("/deal/search", searchDeals);
router.get("/deal/count", countDeals);

module.exports = router;
