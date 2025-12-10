const Brand = require("../models/brand");
const slugify = require("slugify");
const { commonResponse } = require("../utils/reponse/response");
const { validateBrand } = require("../utils/validators/fieldsValidator");


exports.createBrand = async (req, res) => {
  try {
    const { name, brand_id, meta_title, meta_description, image } = req.body;
    
    if (!validateBrand(req.body)) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }
    
    const brand = new Brand({
      name,
      slug: slugify(name),
      brand_id,
      meta_title,
      meta_description,
      image
    });
    
    const data = await brand.save();
    
    if (data) {
      return res
        .status(201)
        .json(commonResponse("Brand created successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Brand not created", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error creating brand:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Brand.findOne({ _id: id }).exec();

    if (data) {
      return res.status(200).json(commonResponse("Brand found", true, data));
    } else {
      return res.status(404).json(commonResponse("Brand not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching brand:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getBrands = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await Brand.find()
      .skip(skip ? parseInt(skip, 10) : 0)
      .limit(limit ? parseInt(limit, 10) : 10)
      .exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Brands found", true, data));
    } else {
      return res.status(404).json(commonResponse("Brands not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching brands:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id, name, brand_id, meta_title, meta_description, image } = req.body;
    //console.log(req.body);

    const data = await Brand.findOneAndUpdate(
      { _id: id },
      {
        name,
        slug: slugify(name),
        brand_id,
        meta_title,
        meta_description,
        image
      },
      { new: true }
    ).exec();

    if (data) {
      return res
        .status(200)
        .json(commonResponse("Brand updated successfully", true, data));
    } else {
      return res.status(404).json(commonResponse("Brand not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error updating brand:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await Brand.deleteMany({ _id: { $in: id } }).exec();
    
    if (result.deletedCount > 0) {
      return res.status(200).json(commonResponse("Brand(s) deleted successfully", true));
    } else {
      return res.status(404).json(commonResponse("Brand(s) not found or not deleted", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error deleting brand:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.searchBrand = async (req, res) => {
  try {
    const { name, brand_id, slug } = req.query;
    const query = {
      ...(name && { name: { $regex: name, $options: "i" } }),
      ...(slug && { slug: { $regex: slug, $options: "i" } }),
      ...(brand_id && { brand_id: brand_id }),
    };

    const data = await Brand.find(query).exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Brand(s) found", true, data));
    } else {
      return res.status(404).json(commonResponse("Brand(s) not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error searching for brand:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const data = await Brand.find().exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Brands found", true, data));
    } else {
      return res.status(404).json(commonResponse("No brands found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching all brands:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countBrands = async (req, res) => {
  try {
    const data = await Brand.countDocuments();

    if (data !== null) {
      return res.status(200).json(commonResponse("Brands found", true, data));
    } else {
      return res.status(404).json(commonResponse("No brands found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error counting brands:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

