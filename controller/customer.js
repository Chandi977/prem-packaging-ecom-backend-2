const Customers = require("../models/customer")
const { commonResponse } = require("../utils/reponse/response");
const sendContactUSInfoEmail = require("../utils/EmailTemplate/contactUs");

exports.createCustomer = async (req, res) => {
    const { name, email, phone_no, message } = req.body;
  
    try {
      if (!name || !email || !phone_no) {
        // 400 Bad Request for missing or invalid fields
        return res.status(400).json(commonResponse("Invalid fields", false));
      }
  
      const customer = new Customers({
        name,
        email,
        phone_no,
        message,
      });
  
      const data = await customer.save();
  
      if (data) {
        sendContactUSInfoEmail(data.email, 'Customer"s Message.', data);
       
        return res.status(201).json(commonResponse("Customer created successfully", true, data));
      } else {
      
        return res.status(400).json(commonResponse("Customer not created", false));
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      
      return res.status(500).json(commonResponse("Internal Server Error", false));
    }
  };

  exports.getCustomerData = async (req, res) => {
    try {
      const { Id } = req.params;
      // const data = await custom_packaging.findOne({ _id: id }).exec();
  
      //console.log("Searching for Custom Form Data with ID:", Id);
  const data = await Customers.find({ _Id:Id }).exec();
  //console.log("Data found:", data);
  
      if (!data) {
        return res.status(404).json(commonResponse("Customers Data not found", false));
      }
  
      return res.status(200).json(commonResponse("Customers Data fetched", true, data));
    } catch (error) {
      console.error("Error in getCustomPackageData:", error);
      return res.status(500).json(commonResponse("Internal Server Error", false));
    }
  };
  
  // Count the number of custom packaging data entries
  exports.countCustomer = async (req, res) => {
    try {
      const data = await Customers.countDocuments();
  
      if (data !== undefined) {
        return res.status(200).json(commonResponse("Customers Data count", true, data));
      } else {
        return res.status(400).json(commonResponse("Unable to countCustomers", false));
      }
    } catch (error) {
      console.error("Error counting custom packages:", error);
      return res.status(500).json(commonResponse("Internal server error", false));
    }
  };
  

  