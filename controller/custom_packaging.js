const custom_packaging = require("../models/custom_packaging");
const { commonResponse } = require("../utils/reponse/response");
const sendCustomPackagingEmail = require("../utils/EmailTemplate/CustomPackaging");


exports.createCustom_Package = async (req, res) => {
  const {
    company_name,
    product_category,
    moq,
    rich_text,
    contact_person_name,
    contact_person_mobile_number,
    contact_person_email,
  } = req.body;

  try {
    // Check for missing fields
    if (
      !company_name ||
      !product_category ||
      !moq ||
      !rich_text ||
      !contact_person_name ||
      !contact_person_mobile_number ||
      !contact_person_email
    ) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    // Create a new custom_package instance
    const customPackage = new custom_packaging({
      company_name,
      product_category,
      moq,
      rich_text,
      contact_person_name,
      contact_person_mobile_number,
      contact_person_email,
    });

    // Save the custom_package data to the database
    const data = await customPackage.save();

    // Check if data was successfully saved
    if (data) {
      sendCustomPackagingEmail(data.contact_person_email, 'Custom Packaging Form .', data);

      return res
        .status(201)
        .json(commonResponse("Customer created successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Customer not created", false));
    }
  } catch (error) {
    console.error("Error creating custom package:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getCustomPackageData = async (req, res) => {
  try {
    const { Id } = req.params;
    // const data = await custom_packaging.findOne({ _id: id }).exec();

    //console.log("Searching for Custom Form Data with ID:", Id);
const data = await custom_packaging.find({ _Id:Id }).exec();
//console.log("Data found:", data);

    if (!data) {
      return res.status(404).json(commonResponse("Custom Form Data not found", false));
    }

    return res.status(200).json(commonResponse("Custom Form Data fetched", true, data));
  } catch (error) {
    console.error("Error in getCustomPackageData:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

// Count the number of custom packaging data entries
exports.countCustomPackages = async (req, res) => {
  try {
    const data = await custom_packaging.countDocuments();

    if (data !== undefined) {
      return res.status(200).json(commonResponse("Custom Form Data count", true, data));
    } else {
      return res.status(400).json(commonResponse("Unable to count Custom Form Data", false));
    }
  } catch (error) {
    console.error("Error counting custom packages:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};


