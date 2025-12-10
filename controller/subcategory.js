const SubCategory = require("../models/subCategory");
const Category=require("../models/category");
const slugify = require("slugify");
const { commonResponse } = require("../utils/reponse/response");
const { validateSubCategory } = require("../utils/validators/fieldsValidator");

exports.createSubCategory = async (req, res) => {
  const { name, sub_category_id, meta_title, meta_description, category } =
    req.body;
  
  try {
    // Validate the request body
    if (!validateSubCategory(req.body)) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    // Create a new SubCategory instance
    const subCategory = new SubCategory({
      name,
      slug: slugify(name),
      sub_category_id,
      meta_title,
      meta_description,
      category,
    });

    // Save the subCategory to the database
    const data = await subCategory.save();

    if (!data) {
      return res.status(400).json(commonResponse("Sub Category not created", false));
    }

    // Update the associated Category to include the new subCategory
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: category },
      { $push: { subCategories: data._id } },
      { new: true }
    ).exec();

    if (!updatedCategory) {
      return res.status(500).json(commonResponse("Failed to update Category", false));
    }

    // Return success response
    res.status(201).json(commonResponse("Sub Category created successfully", true, data));
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SubCategory.findOne({ _id: id }).populate("category").exec();

    if (!data) {
      res.status(404).json(commonResponse("Sub Category not found", false));
    } else {
      res.status(200).json(commonResponse("Sub Category found", true, data));
    }
  } catch (error) {
    console.error("Error in getSubCategory:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await SubCategory.find()
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 10)
      .populate("category")
      .exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Sub Categories found", true, data));
    } else {
      res.status(404).json(commonResponse("Sub Categories not found", false));
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id, name, sub_category_id, meta_title, meta_description, category } =
      req.body;
    const data = await SubCategory.findOneAndUpdate(
      { _id: id },
      {
        name,
        slug: slugify(name),
        sub_category_id,
        meta_title,
        meta_description,
        category,
      },
      { new: true }
    ).exec();

    if (data) {
      res.status(200).json(commonResponse("Sub Category updated", true, data));
    } else {
      res.status(400).json(commonResponse("Sub Category not updated", false));
    }
  } catch (error) {
    // Handle errors here
    console.error("Error updating sub category:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id || !Array.isArray(id) || id.length === 0) {
      return res.status(400).json(commonResponse("Invalid input data", false));
    }

    const data = await SubCategory.deleteMany({ _id: { $in: id } }).exec();

    if (data.deletedCount > 0) {
      return res.status(200).json(commonResponse("Sub Category deleted", true, data));
    } else {
      return res.status(404).json(commonResponse("Sub Category not found", false));
    }
  } catch (error) {
    console.error("Error in deleteSubCategory:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const data = await SubCategory.find().exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("All Sub Categories found", true, data));
    } else {
      res.status(404).json(commonResponse("No Sub Categories found", false));
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json(commonResponse("An error occurred while fetching Sub Categories", false));
  }
};

exports.searchSubCategory = async (req, res) => {
  try {
    const { name, sub_category_id, slug } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (sub_category_id) {
      query.sub_category_id = sub_category_id;
    }
    if (slug) {
      query.slug = { $regex: slug, $options: "i" };
    }

    const data = await SubCategory.find(query).exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Sub Categories found", true, data));
    } else {
      res.status(404).json(commonResponse("Sub Categories not found", false));
    }
  } catch (error) {
    console.error("Error in searchSubCategory:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countSubCategories = async (req, res) => {
  try {
    const data = await SubCategory.find().count();

    if (data !== null && data !== undefined) {
      // Check if data is not null or undefined
      res.status(200).json(commonResponse("Sub Categories found", true, data));
    } else {
      res.status(404).json(commonResponse("Sub Categories not found", false));
    }
  } catch (error) {
    console.error("Error in countSubCategories:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

