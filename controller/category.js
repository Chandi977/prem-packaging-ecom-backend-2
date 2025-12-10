const Category = require("../models/category");
const { commonResponse } = require("../utils/reponse/response");
var slugify = require("slugify");
const { validateCategory } = require("../utils/validators/fieldsValidator");

exports.createCategory = async (req, res) => {
  const { name, category_id, meta_title, meta_description } = req.body;
  //console.log(req.body);
  
  // Check if the request body is valid
  if (!validateCategory(req.body)) {
    // Return a 400 Bad Request response with an error message
    return res.status(400).json(commonResponse("All fields are required", false));
  }

  try {
    // Create a new Category instance
    const category = new Category({
      name,
      slug: slugify(name),
      category_id,
      meta_title,
      meta_description,
    });

    // Save the category to the database
    const data = await category.save();

    // Check if the category was saved successfully
    if (data) {
      // Return a 201 Created response with a success message and the created data
      return res
        .status(201)
        .json(commonResponse("Category created successfully", true, data));
    } else {
      // Return a 400 Bad Request response with an error message
      return res.status(400).json(commonResponse("Unable to create category", false));
    }
  } catch (error) {
    // Handle any unexpected errors that occurred during the operation
    console.error("Error creating category:", error);
    // Return a 500 Internal Server Error response with an error message
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getCategories = async (req, res) => {
  const { skip, limit } = req.query;
  
  try {
    const data = await Category.find()
      .skip(skip ? parseInt(skip) : 0)
      .limit(limit ? parseInt(limit) : 10)
      .exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Categories fetched", true, data));
    } else {
      // If no categories are found, you might want to send a 404 response.
      res.status(404).json(commonResponse("No categories found", false));
    }
  } catch (err) {
    // Handle database query errors
    console.error("Error fetching categories:", err);
    res.status(500).json(commonResponse("Unable to fetch categories due to a server error", false));
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Category.findOne({ _id: id }).exec();

    if (!data) {
      res.status(404).json(commonResponse("Category not found", false));
      return; // Return early to avoid executing the success response code
    }

    res.status(200).json(commonResponse("Category fetched", true, data));
  } catch (error) {
    console.error("Error in getCategory:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id, name, category_id, meta_title, meta_description } = req.body;
    
    // Attempt to update the category
    const data = await Category.findOneAndUpdate(
      { _id: id },
      {
        name,
        slug: slugify(name),
        category_id,
        meta_title,
        meta_description,
      }
    ).exec();

    if (data) {
      res.status(200).json(commonResponse("Category updated successfully", true, data));
    } else {
      res.status(404).json(commonResponse("Category not found", false));
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json(commonResponse("An error occurred while updating the category", false));
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;
  
  try {
    // Attempt to delete categories
    const data = await Category.deleteMany({ _id: { $in: id } }).exec();
    
    if (data.deletedCount > 0) {
      // Categories were deleted successfully
      res.status(200).json(commonResponse("Category deleted successfully", true, data));
    } else {
      // No categories were deleted (IDs not found)
      res.status(404).json(commonResponse("No matching categories found for deletion", false));
    }
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error("Error deleting categories:", error);
    res.status(500).json(commonResponse("Unable to delete categories due to a server error", false));
  }
};

exports.allCategories = async (req, res) => {
  try {
    const data = await Category.find().populate("subCategories").exec();
    
    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Categories fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No categories found", false));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.searchCategories = async (req, res) => {
  try {
    const { name, category_id, slug } = req.query;
    const filter = {
      ...(name && { name: { $regex: name, $options: "i" } }),
      ...(category_id && { category_id: category_id }),
      ...(slug && { slug: { $regex: slug, $options: "i" } }),
    };

    const data = await Category.find(filter).exec();

    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Categories fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No categories found", false));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.countCategories = async (req, res) => {
  try {
    const data = await Category.find().count();

    if (data !== undefined) {
      res.status(200).json(commonResponse("Categories count", true, data));
    } else {
      res.status(400).json(commonResponse("Unable to count categories", false));
    }
  } catch (error) {
    // Handle any unexpected errors that occurred during the execution
    console.error("Error counting categories:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

