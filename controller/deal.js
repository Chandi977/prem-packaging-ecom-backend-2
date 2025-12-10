const Deal = require("../models/deals");
const Product = require("../models/product");
const { commonResponse } = require("../utils/reponse/response");

exports.createDeal = async (req, res) => {
  try {
    const { product, newPrice, discount, deal_id, meta_title, meta_description } =
      req.body;

    // Check for required fields
    if (!product || !newPrice || !discount) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    // Create a new Deal instance
    const deal = new Deal({
      product,
      newPrice,
      discount,
      deal_id,
      meta_title,
      meta_description,
    });

    // Save the deal to the database
    const savedDeal = await deal.save();

    // Check if the deal was successfully saved
    if (savedDeal) {
      return res.status(201).json({ success: true, message: "Deal created successfully", data: savedDeal });
    } else {
      return res.status(500).json({ success: false, message: "Failed to create the deal" });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating deal:", error);
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

exports.getDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Deal.findOne({ _id: id }).populate("product").exec();

    if (data) {
      res.status(200).json(commonResponse("Deal found", true, data));
    } else {
      res.status(404).json(commonResponse("Deal not found", false));
    }
  } catch (error) {
    console.error("Error in getDeal:", error);

    // Handle specific types of errors
    if (error.name === "CastError") {
      // Handle invalid ObjectId format error
      res.status(400).json(commonResponse("Invalid Deal ID format", false));
    } else if (error.name === "ValidationError") {
      // Handle validation errors (e.g., required fields not provided)
      res.status(400).json(commonResponse("Validation error", false, error.message));
    } else {
      // Handle other unexpected errors
      res.status(500).json(commonResponse("Internal server error", false));
    }
  }
};

exports.getAllDeals = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await Deal.find({})
      .skip(skip ? parseInt(skip) : 0)
      .limit(limit ? parseInt(limit) : 10)
      .populate("product")
      .exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Deals found", true, data));
    } else {
      res.status(404).json(commonResponse("Deals not found", false));
    }
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const {
      id,
      product,
      newPrice,
      discount,
      deal_id,
      meta_title,
      meta_description,
    } = req.body;

    // Check if the 'id' field is missing in the request body
    if (!id) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    // Try to update the deal and get the updated data
    const updatedDeal = await Deal.findOneAndUpdate(
      { _id: id },
      { product, newPrice, discount, deal_id, meta_title, meta_description },
      { new: true }
    ).exec();

    // Check if the deal was found and updated successfully
    if (updatedDeal) {
      return res.status(200).json(commonResponse("Deal updated", true, updatedDeal));
    } else {
      // If the deal was not found, return an error response
      return res.status(404).json(commonResponse("Deal not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors that may occur during the update
    console.error("Error updating deal:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.body;

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json(commonResponse("Invalid or empty ID array", false));
    }

    const data = await Deal.deleteMany({ _id: { $in: id } }).exec();

    if (data.deletedCount > 0) {
      res.status(200).json(commonResponse("Deal(s) deleted", true, data));
    } else {
      res.status(404).json(commonResponse("Deal(s) not found for deletion", false));
    }
  } catch (error) {
    console.error("Error deleting deals:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countDeals = async (req, res) => {
  try {
    const data = await Deal.countDocuments({}).exec();
    if (data !== null) {
      res.status(200).json(commonResponse("Deal count", true, data));
    } else {
      res.status(400).json(commonResponse("Deal count not found", false));
    }
  } catch (error) {
    console.error("Error counting deals:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.allDeals = async (req, res) => {
  try {
    const data = await Deal.find({}).populate("product").exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Deals found", true, data));
    } else {
      res.status(404).json(commonResponse("No deals found", false));
    }
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.searchDeals = async (req, res) => {
  try {
    const { id, newPrice, discount } = req.query;
    const query = {
      ...(id && { deal_id: id }),
      ...(newPrice && { newPrice: newPrice }),
      ...(discount && { discount: discount }),
    };

    const data = await Deal.find(query)
      .populate("product")
      .exec();

    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Deals found", true, data));
    } else {
      res.status(404).json(commonResponse("Deals not found", false));
    }
  } catch (error) {
    console.error("Error searching for deals:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

