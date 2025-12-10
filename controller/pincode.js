const Pincode = require("../models/pincode");
const { commonResponse } = require("../utils/reponse/response");

exports.createFreight = async (req, res) => {
  const {
    pincode,
    city,
    oda,
    state,
    upto10,
    upto20,
    upto30,
    above30,
    b2cZone,
    b2bZone,
  } = req.body;

  //console.log(req.body);

  try {
    if (
      !pincode ||
      !city ||
      !state ||
      (oda !== true && oda !== false) ||
      !upto10 ||
      !upto20 ||
      !upto30 ||
      !above30 ||
      !b2cZone ||
      !b2bZone
    ) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    const newPincode = new Pincode({
      pincode,
      city,
      oda,
      upto10,
      upto20,
      upto30,
      above30,
      b2cZone,
      b2bZone,
    });

    const savedPincode = await newPincode.save();

    if (savedPincode) {
      return res
        .status(201)
        .json(
          commonResponse("Pincode created successfully", true, savedPincode)
        );
    } else {
      return res.status(400).json(commonResponse("Pincode not created", false));
    }
  } catch (error) {
    console.error("Error creating Pincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.fetchFreight = async (req, res) => {
  try {
    // Assuming you want to fetch all Pincode records
    const pincodeData = await Pincode.find();

    if (pincodeData) {
      return res
        .status(200)
        .json(
          commonResponse("Pincode data fetched successfully", true, pincodeData)
        );
    } else {
      return res
        .status(404)
        .json(commonResponse("No Pincode data found", false));
    }
  } catch (error) {
    console.error("Error fetching Pincode data:", error);
    return res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.fetchOneFreight = async (req, res) => {
  const { pincode, packweight } = req.body;
  //console.log(req.body)

  try {
    const matchingData = await Pincode.findOne({ pincode });

    if (matchingData) {
      //console.log("packweight:", packweight);
      // console.log("upto10kg:", matchingData.upto10kg);
      // console.log("between10to20kg:", matchingData.between10to20kg);
      // console.log("between20to30kg:", matchingData.between20to30kg);
      // console.log("above30kg:", matchingData.above30kg);

      if (matchingData.oda) {
        let shippingCost;

        //console.log(packweight);
        // Round up packweight to the nearest integer
        const roundedPackweight = Math.ceil(packweight);
        //console.log(roundedPackweight);
        if (roundedPackweight >= 0 && roundedPackweight <= 10) {
          shippingCost = matchingData.upto10 * roundedPackweight;
        } else if (roundedPackweight > 10 && roundedPackweight <= 20) {
          shippingCost = 1000 + matchingData.upto20 * roundedPackweight;
        } else if (roundedPackweight > 20 && roundedPackweight <= 30) {
          shippingCost = 1000 + matchingData.upto30 * roundedPackweight;
        } else {
          shippingCost = 1000 + matchingData.above30 * roundedPackweight;
        }

        res.json({
          facilityCity: matchingData.city,
          facilityState: matchingData.state,
          ODA: matchingData.oda,
          shippingCost: shippingCost,
        });
      } else {
        //console.log(packweight);
        let shippingCost;
        const roundedPackweight = Math.ceil(packweight);
        //console.log(roundedPackweight);
        if (roundedPackweight >= 0 && roundedPackweight <= 10) {
          shippingCost = matchingData.upto10 * roundedPackweight;
        } else if (roundedPackweight > 10 && roundedPackweight <= 20) {
          shippingCost = matchingData.upto20 * roundedPackweight;
        } else if (roundedPackweight > 20 && roundedPackweight <= 30) {
          shippingCost = matchingData.upto30 * roundedPackweight;
        } else {
          shippingCost = matchingData.above30 * roundedPackweight;
        }
        res.json({
          facilityCity: matchingData.city,
          facilityState: matchingData.state,
          ODA: matchingData.oda,
          shippingCost: shippingCost,
        });
      }
    } else {
      res.status(404).json({ message: "Data not found for the provided PIN" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPincode = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const data = await Pincode.find()
      // .skip(skip ? parseInt(skip, 1000) : 0)
      // .limit(limit ? parseInt(limit, 1000) : 1000)
      .exec();

    if (data && data.length > 0) {
      return res.status(200).json(commonResponse("Pincode found", true, data));
    } else {
      return res.status(404).json(commonResponse("Pincode not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching getPincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countPincode = async (req, res) => {
  try {
    const data = await Pincode.countDocuments();

    if (data !== null) {
      return res.status(200).json(commonResponse("Pincode found", true, data));
    } else {
      return res.status(404).json(commonResponse("No Pincodes found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error counting countPincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.searchPincode = async (req, res) => {
  try {
    const { pincode, city, state } = req.query;
    //console.log(req.query);
    const query = {
      ...(pincode && { pincode: pincode }),
      ...(city && { city: { $regex: city, $options: "i" } }),
      ...(state && { state: { $regex: state, $options: "i" } }),
    };
    //console.log(query);

    const data = await Pincode.find(query).exec();

    if (data && data.length > 0) {
      return res
        .status(200)
        .json(commonResponse("Pincode(s) found", true, data));
    } else {
      return res.status(404).json(commonResponse("Pincode not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error searching for searchPincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.updatePincode = async (req, res) => {
  try {
    const {
      _id,
      pincode,
      city,
      state,
      oda,
      upto10,
      upto20,
      upto30,
      above30,
      b2cZone,
      b2bZone,
    } = req.body;

    //console.log(req.body);

    const data = await Pincode.findOneAndUpdate(
      { _id: _id },
      {
        pincode,
        city,
        state,
        oda,
        upto10,
        upto20,
        upto30,
        above30,
        b2cZone,
        b2bZone,
      },
      { new: true }
    ).exec();

    if (data) {
      return res
        .status(200)
        .json(commonResponse("Pincode updated successfully", true, data));
    } else {
      return res.status(404).json(commonResponse("Pincode not found", false));
    }
  } catch (error) {
    console.error("Error updating pincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getPincodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Pincode.findOne({ _id: id }).exec();

    if (data) {
      return res.status(200).json(commonResponse("Pincode found", true, data));
    } else {
      return res.status(404).json(commonResponse("Pincode not found", false));
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error("Error fetching Pincode:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};
