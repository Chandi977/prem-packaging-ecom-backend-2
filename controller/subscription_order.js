const subscription_order = require("../models/subscription_order");
const { commonResponse } = require("../utils/reponse/response");

exports.createSubscription_order = async (req, res) => {
  const {
    user,
    product_name,
    product_category,
    moq,
    number_of_months,
    contact_person_name,
    contact_person_mobile_number,
    contact_person_email,
  } = req.body;

  try {
    // Check for missing fields
    if (
      !product_name ||
      !product_category ||
      !moq ||
      !number_of_months ||
      !contact_person_name ||
      !contact_person_mobile_number ||
      !contact_person_email
    ) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    // Create a new custom_package instance
    const subscriptionOrder = new subscription_order({
      user,
      product_name,
      product_category,
      moq,
      number_of_months,
      contact_person_name,
      contact_person_mobile_number,
      contact_person_email,
    });

    // Save the custom_package data to the database
    const data = await subscriptionOrder.save();

    // Check if data was successfully saved
    if (data) {
      return res
        .status(201)
        .json(
          commonResponse("Subscription Order created successfully", true, data)
        );
    } else {
      return res
        .status(400)
        .json(commonResponse("Subscription Order not created", false));
    }
  } catch (error) {
    console.error("Error creating custom package:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};
