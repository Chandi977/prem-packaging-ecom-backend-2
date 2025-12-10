const Order = require("../models/order");
const Product = require("../models/product");
const { commonResponse } = require("../utils/reponse/response");
const sendOrderPlacedEmail = require("../utils/EmailTemplate/OrderPlaced");
const sendNewOrderPlacedEmail = require("../utils/EmailTemplate/NewOrderPI");
const sendOrderShippedEmail = require("../utils/EmailTemplate/OrderShipped");
const sendOrderDeliveredEmail = require("../utils/EmailTemplate/OrderDelivered");
const sendOrderDeliveredEmailPI = require("../utils/EmailTemplate/OrderDeliveredPI");
const sendPaymentConfirmationEmail = require("../utils/EmailTemplate/PaymentConfirmed");
const sendPaymentReceivedPI = require("../utils/EmailTemplate/PaymentReceivedPI");
const sendPaymentReceived = require("../utils/EmailTemplate/PaymentReceived");
const sendOrderShippedEmailPI = require("../utils/EmailTemplate/OrderShippedPI");
const Razorpay = require("razorpay");
const { S3Client } = require("@aws-sdk/client-s3");
const instance = new Razorpay({
  key_id: "RAZORPAY_KEY_ID",
  key_secret: "RAZORPAY_KEY_SECRET",
});
require("dotenv").config();

const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

let orderCounter = 0;

const makeCall = async (image) => {
  s3 = new S3Client({
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    },
    region: "ap-south-1",
  });
  const par = {
    Bucket: "prem-industries-ecom-images",
    Key: image,
  };
  const command = new GetObjectCommand(par);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

const processImages = async (features) => {
  let result;
  let temp = features;
  for (let i = 0; i < features?.length; i++) {
    result = await makeCall(features[i]?.image);
    temp[i]["image"] = result;
  }
  return temp;
};

exports.createOrder = async (req, res) => {
  try {
    const lastOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });

    let lastOrderNumber = 0;
    if (lastOrder && lastOrder.orderId) {
      const lastOrderIdParts = lastOrder.orderId.split("-");
      lastOrderNumber = parseInt(lastOrderIdParts[1]);
    }

    const newOrderNumber = lastOrderNumber + 1;
    const newOrderId = `PI-${newOrderNumber}`;
    //console.log(newOrderId, "24");

    const {
      items,
      name,
      phone,
      email,
      address,
      town,
      state,
      pincode,
      landmark,
      gstin,
      user,
      total,
      status,
      totalPackWeight,
      shippingCost,
      totalOrderValue,
      totalCartValue,
      paymentStatus,
      utrNumber,
      couponCode,
    } = req.body;

    const order = new Order({
      orderId: newOrderId,
      items,
      name,
      phone,
      email,
      address,
      town,
      state,
      pincode,
      landmark,
      gstin,
      user,
      total,
      status,
      totalPackWeight,
      shippingCost,
      totalOrderValue,
      totalCartValue,
      paymentStatus,
      utrNumber,
      couponCode,
    });

    for (const item of items) {
      //console.log("76", items);
      const { product: product, quantity, packSize } = item;

      const product1 = await Product.findById(product);

      //console.log("81", product1);

      const priceListEntry = product1.priceList.find(
        (entry) => entry.number === packSize
      );

      if (priceListEntry) {
        // Update the stock_quantity by subtracting the quantity
        priceListEntry.stock_quantity -= quantity;
      } else {
        // Handle the case where the packSize is not found
        console.error(
          `PriceList entry not found for product ${productId} and packSize ${packSize}`
        );
      }
      // Save the updated product
      await product1.save();
    }

    const data = await order.save();

    if (data) {
      sendOrderPlacedEmail(
        data.email,
        "Your Order has been placed with us.",
        data
      );
      sendNewOrderPlacedEmail(
        data.email,
        "A new order has been placed with us.",
        data
      );

      return res
        .status(201)
        .json(commonResponse("Order created successfully", true, data));
    } else {
      return res
        .status(500)
        .json(commonResponse("Failed to create the order", false));
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.allOrders = async (req, res) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("user items.product")
      .exec();

    if (orders.length > 0) {
      res.status(200).json(commonResponse("Orders found", true, orders));
    } else {
      res.status(404).json(commonResponse("No orders found", false));
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countOrders = async (req, res) => {
  try {
    const data = await Order.countDocuments().exec();

    if (data !== null && data !== undefined) {
      // Successful response with 200 status code
      res.status(200).json(commonResponse("Orders found", true, data));
    } else {
      // No data found with a 404 status code
      res.status(404).json(commonResponse("Orders not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors with a 500 status code
    console.error("Error in countOrders:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countOrderStatus = async (req, res) => {
  try {
    const orderCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const countsMap = {};
    orderCounts.forEach((statusCount) => {
      countsMap[statusCount._id] = statusCount.count;
    });

    // Extract counts for specific statuses
    const placedCount = countsMap["placed"] || 0;
    const paymentDoneCount = countsMap["Payment Done"] || 0;
    const paymentVerifiedCount = countsMap["Payment Verified"] || 0;
    const dispatchedCount = countsMap["Dispatched"] || 0;
    const deliveredCount = countsMap["Delivered"] || 0;

    const responseData = {
      placedCount,
      paymentDoneCount,
      paymentVerifiedCount,
      dispatchedCount,
      deliveredCount,
    };

    res.status(200).json({
      success: true,
      message: "Order counts retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in countOrders:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.specificOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Use a try-catch block to handle potential errors in the database query
    const data = await Order.findOne({ _id: id })
      .populate("user items.product")
      .exec();

    if (data) {
      res.status(200).json(commonResponse("Order found", true, data));
    } else {
      // Return a 404 status code when the order is not found
      res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in specificOrder:", error);

    // Return a 500 status code and an error message
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, id } = req.body;

    // console.log(req.body);

    // Try to update the order
    const data = await Order.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    ).exec();

    if (data) {
      let message = "Order updated";

      if (status === "shipped") {
        // Send 'Order Shipped' email
        // sendOrderShippedEmail(data.email, "Your Order has been shipped", data);
        message = "Order shipped";
      } else if (status === "delivered") {
        // Send 'Order Delivered' email
        // sendOrderDeliveredEmail(
        //   data.email,
        //   "Your Order has been delivered",
        //   data
        // );
        message = "Order delivered";
      }

      return res.status(200).json(commonResponse(message, true, data));
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateOrderShipping = async (req, res) => {
  try {
    const { shippingDate, id, status } = req.body;
    //console.log(req.body);

    const data = await Order.findOneAndUpdate(
      { _id: id },
      { shippingDate: shippingDate, status: status },
      { new: true }
    ).exec();
    if (data) {
      // console.log(data);

      let message = "Shipping Date updated";

      // sendOrderShippedEmail(data.email, 'Your Order has been shipped', data);

      return res.status(200).json(commonResponse(message, true, data));
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateOrderTracking = async (req, res) => {
  try {
    const { trackingId, id, deliveryPartner } = req.body;
    //console.log("304", req.body);

    // Try to update the order
    const data = await Order.findOneAndUpdate(
      { _id: id },
      { trackingId: trackingId, deliveryPartner: deliveryPartner },
      { new: true }
    ).exec();

    if (data) {
      let message = "Tracking Id updated";

      //console.log(data);
      sendOrderShippedEmail(data.email, "Your Order has been shipped", data);
      sendOrderShippedEmailPI(data.email, "Order Shipped", data);

      return res.status(200).json(commonResponse(message, true, data));
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateOrderDelivered = async (req, res) => {
  try {
    const { deliveredDate, id, status } = req.body;
    //console.log(req.body);

    // Try to update the order
    const data = await Order.findOneAndUpdate(
      { _id: id },
      { deliveredDate: deliveredDate, status: status },
      { new: true }
    ).exec();

    if (data) {
      let message = "Delivery Date updated";

      sendOrderDeliveredEmail(data.email, "Order Delivered", data);

      sendOrderDeliveredEmailPI(data.email, "Your Order Delivered", data);

      return res.status(200).json(commonResponse(message, true, data));
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ email }).populate("items.product").exec();

    if (orders && orders.items && orders.items[0]) {
      const image = await processImages(orders.items[0].images[0].image);
      orders.items[0].images[0].image = image;
    }

    if (orders.length > 0) {
      res.status(200).json({
        success: true,
        message: "Orders found for the email address",
        data: orders,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No orders found for the email address",
      });
    }
  } catch (error) {
    console.error("Error fetching orders by email:", error);

    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

exports.latestOrderByEmail = async (req, res) => {
  try {
    const { email_address } = req.params;

    const latestOrder = await Order.findOne({ email_address })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .exec();

    if (latestOrder) {
      res.status(200).json({
        success: true,
        message: "Latest order found for the email address",
        data: latestOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No latest order found for the email address",
      });
    }
  } catch (error) {
    console.error("Error fetching latest order by email:", error);

    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

exports.updateUtrNumber = async (req, res) => {
  try {
    const { _id, utrNumber, paymentStatus, status } = req.body;
    //console.log(req.body);

    const data = await Order.findOneAndUpdate(
      { _id: _id },
      {
        utrNumber: utrNumber,
        paymentStatus: paymentStatus,
        status: status,
        paymentDate: new Date(),
      },
      { new: true }
    );

    if (data) {
      // console.log(updatedOrder);

      sendPaymentReceived(data.email, "UTR Number Received.", data);
      return res
        .status(200)
        .json(
          commonResponse(
            "UTR number and Payment Status updated successfully",
            true,
            data
          )
        );
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating UTR number and Payment Status:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { _id, paymentStatus, status } = req.body;
    //console.log(req.body);

    const data = await Order.findOneAndUpdate(
      { _id: _id },
      { paymentStatus: paymentStatus, status: status },
      { new: true }
    );

    if (data) {
      //console.log("477", data);
      if (paymentStatus === "Payment Verified") {
        sendPaymentConfirmationEmail(data.email, "Payment Verified", data);
        sendPaymentReceivedPI(
          data.email,
          "Your Order has been placed with us.",
          data
        );
        // sendPaymentConfirmationEmail(updatedOrder.email, 'Your payment has been submitted successfully.', updatedOrder);
      }

      return res
        .status(200)
        .json(
          commonResponse("Payment Status updated successfully", true, data)
        );
    } else {
      return res.status(404).json(commonResponse("Order not found", false));
    }
  } catch (error) {
    console.error("Error updating UTR number and Payment Status:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.searchOrder = async (req, res) => {
  try {
    const { orderId, name } = req.query;
    //console.log("524", req.query);
    const filter = {
      ...(orderId && { orderId: { $regex: orderId, $options: "i" } }),
      ...(name && { name: { $regex: name, $options: "i" } }),
    };
    //console.log("525", filter);
    const data = await Order.find(filter).sort({ createdAt: -1 }).exec();

    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Orders fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No Order found", false));
    }
  } catch (error) {
    console.error("Error fetching Products: ", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.createPayment = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  instance.orders.create(options, (err, order) => {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(500).json({ error: "Error creating order" });
    }
    //console.log("Order created:", order);
    res.json(order);
  });
};
