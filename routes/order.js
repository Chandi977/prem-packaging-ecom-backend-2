const express = require("express");

const {
  createOrder,
  allOrders,
  specificOrder,
  updateOrder,
  countOrders,
  getOrdersByEmail,
  latestOrderByEmail,
  updateUtrNumber,
  updatePaymentStatus,
  updateOrderShipping,
  updateOrderTracking,
  updateOrderDelivered,
  countOrderStatus,
  searchOrder,
  createPayment,
} = require("../controller/order");

const router = express.Router();

router.post("/order/create", createOrder);
router.get("/order/all/orders", allOrders);
router.get("/order/get/:id", specificOrder);
router.put("/order/update", updateOrder);
router.put("/order/update/shipping", updateOrderShipping);
router.put("/order/update/tracking", updateOrderTracking);
router.put("/order/update/delivered", updateOrderDelivered);
// router.post("/product/delete", deleteProduct);
router.get("/order/search", searchOrder);
router.get("/my/orders/:email", getOrdersByEmail);
router.get("/order/count", countOrders);
router.get("/order/count/status", countOrderStatus);
router.get("/order/count", countOrders);
router.get("/order/latest", latestOrderByEmail);
router.put("/order/update/utr", updateUtrNumber);
router.put("/order/update/payment/status", updatePaymentStatus);
// router.post("/product/filter", filterProducts);
router.post("/order/create/payment", createPayment);

module.exports = router;
