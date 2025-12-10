const Coupon = require("../models/coupon");
const { commonResponse } = require("../utils/reponse/response");
const { validateCoupon } = require("../utils/validators/fieldsValidator");

exports.createCoupon = async (req, res) => {
  try {
    const {
      name,
      couponCode,
      type,
      brand,
      category,
      startDate,
      productType,
      endDate,
      noOfUse,
      discountPercentage,
      discountPrice,
      minimumOrderValue,
      maxDiscountCap,
      couponDescription,
    } = req.body;

    //console.log(req.body)

    if (!validateCoupon(req.body)) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    const coupon = new Coupon({
      name,
      couponCode,
      type,
      brand,
      category,
      startDate,
      productType,
      endDate,
      noOfUse,
      discountPercentage,
      discountPrice,
      minimumOrderValue,
      maxDiscountCap,
      couponDescription,
    });

    const data = await coupon.save();

    if (data) {
      return res
        .status(201)
        .json(commonResponse("Coupon created successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Coupon not created", false));
    }
  } catch (error) {
    
    console.error("Error in createCoupon:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await Coupon.find()
      .skip(skip ? parseInt(skip, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 10)
      .exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Coupons found", true, data));
    } else {
      return res.status(404).json(commonResponse("Coupons not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching getCoupon:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countCoupon = async (req, res) => {
  try {
    const count = await Coupon.countDocuments();

    if (count !== null) {
      return res.status(200).json(commonResponse("Coupon found", true, count));
    } else {
      return res.status(404).json(commonResponse("No Coupon found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error in countCoupon:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getSingleCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Coupon.findOne({ _id: id })
      .exec();

    if (data) {
      res.status(200).json(commonResponse("Coupon found", true, data));
    } else {

      res.status(404).json(commonResponse("Coupon not found", false));
    }
  } catch (error) {
    console.error("Error in getSingleCoupon:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getCouponByCouponCode = async (req, res) => {
  try {
    const { couponCode } = req.params;

    const data = await Coupon.findOne({ couponCode: couponCode })
      .exec();

    if (data) {
      res.status(200).json(commonResponse("Coupon found", true, data));
    } else {

      res.status(404).json(commonResponse("Coupon not found", false));
    }
  } catch (error) {
    console.error("Error in getSingleCoupon:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const {
      _id,
      type,
      name,
      couponCode,
      productType,
      brand,
      category,
      startDate,
      endDate,
      noOfUse,
      discountPercentage,
      discountPrice,
      minimumOrderValue,
      maxDiscountCap,
      couponDescription,
    } = req.body;

    //console.log(req.body)

    const updateFields = {
      type,
      name,
      couponCode,
      productType,
      brand,
      category,
      startDate,
      endDate,
      noOfUse,
      discountPercentage,
      discountPrice,
      minimumOrderValue,
      maxDiscountCap,
      couponDescription,
    };

    const updatedCoupon = await Coupon.findOneAndUpdate(
      { _id: _id },
      updateFields,
      { new: true }
    ).exec();

    if (updatedCoupon) {
      return res.status(200).json({
        message: "Coupon updated successfully",
        success: true,
        data: updatedCoupon,
      });
    } else {
      return res.status(404).json({
        message: "Coupon not found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error updating coupon:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    // console.log(req.body)

    const result = await Coupon.deleteMany({ _id: { $in: id } }).exec();
    
    if (result.deletedCount > 0) {
      return res.status(200).json(commonResponse("Coupon(s) deleted successfully", true));
    } else {
      return res.status(404).json(commonResponse("Coupon(s) not found or not deleted", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error deleting Coupon:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};