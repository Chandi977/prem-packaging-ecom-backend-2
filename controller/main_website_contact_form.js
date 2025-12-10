const ContactFormData = require("../models/main_website_contact_form");
const { commonResponse } = require("../utils/reponse/response");
const {
  sendCustomerQueryMainWebsiteEmail,
} = require("../utils/EmailTemplate/CustomerQuery");

exports.createContactForm = async (req, res) => {
  const { name, email, phone_no, message } = req.body;
  try {
    if (!name || !email || !phone_no) {
      // Return a 400 Bad Request response with a meaningful error message.
      return res.status(400).json({ error: "Invalid fields" });
    }

    const contactForm = new ContactFormData({
      name,
      email,
      phone_no,
      message,
    });

    const data = await contactForm.save();

    if (data) {
      sendCustomerQueryMainWebsiteEmail(
        data.email,
        'Customer"s Message.',
        data
      );
      return res
        .status(201)
        .json({ message: "Contact Form created successfully", data });
    } else {
      return res.status(500).json({ error: "Contact Form not created" });
    }
  } catch (error) {
    console.error("Error creating customer:", error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getContactFormData = async (req, res) => {
  try {
    const { Id } = req.params;
    // const data = await custom_packaging.findOne({ _id: id }).exec();

    //console.log("Searching for Custom Form Data with ID:", Id);
    const data = await ContactFormData.find({ _Id: Id })
      .sort({ createdAt: -1 })
      .exec();
    //console.log("Data found:", data);

    if (!data) {
      return res
        .status(404)
        .json(commonResponse("Customers Data not found", false));
    }

    return res
      .status(200)
      .json(commonResponse("Customers Data fetched", true, data));
  } catch (error) {
    console.error("Error in getCustomPackageData:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

// Count the number of custom packaging data entries
exports.countContactFormData = async (req, res) => {
  try {
    const data = await ContactFormData.countDocuments();

    if (data !== undefined) {
      return res
        .status(200)
        .json(commonResponse("Customers Data count", true, data));
    } else {
      return res
        .status(400)
        .json(commonResponse("Unable to countCustomers", false));
    }
  } catch (error) {
    console.error("Error counting custom packages:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};
