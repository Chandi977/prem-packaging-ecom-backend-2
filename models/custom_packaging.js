// Import the mongoose library
const mongoose = require("mongoose");

// Define the custom_form schema using mongoose.Schema
const custom_form = new mongoose.Schema(
  {
    // Define the fields and their data types
    company_name: {
      type: String,
    },
    product_category: {
      type: String,
      required: true, // This field is required
    },
    moq: {
      type: String,
      trim: true,     // Trim whitespace from the input
    },
    rich_text: {
      type: String,
      required: true, // This field is required
    },
    contact_person_name: {
      type: String,
      required: true, // This field is required
    },
    contact_person_mobile_number: {
      type: String,
    },
    contact_person_email: {
      type: String,
    },
  },
  {
    // Define additional options for the schema
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the mongoose model with the name "Custom Packaging Form"
module.exports = mongoose.model("Custom Packaging Form", custom_form);
