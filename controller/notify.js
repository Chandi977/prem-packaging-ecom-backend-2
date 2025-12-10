const Notify = require("../models/notify");
const { commonResponse } = require("../utils/reponse/response");
const { validateNotify } = require("../utils/validators/fieldsValidator");

exports.createNotify = async (req, res) => {
  try {
    const { product_id, name, email_address, mobile_number } = req.body;

    if (!validateNotify(req.body)) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    const notify = new Notify({
      product_id,
      name,
      email_address,
      mobile_number,
    });

    const data = await notify.save();

    if (data) {
      return res
        .status(201)
        .json(commonResponse("Notify created successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Notify not created", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error creating Notify:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getNotify = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await Notify.find()
      .sort({ createdAt: -1 })
      .populate("product_id")
      .skip(skip ? parseInt(skip, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 10)
      .exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Notify found", true, data));
    } else {
      return res.status(404).json(commonResponse("Notify not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching Notify:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countNotifies = async (req, res) => {
  try {
    const data = await Notify.countDocuments();

    if (data !== null) {
      return res.status(200).json(commonResponse("Notify found", true, data));
    } else {
      return res.status(404).json(commonResponse("No Notify found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error counting Notify:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};
