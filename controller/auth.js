const User = require("../models/user");
const JWT = require("jsonwebtoken");
const sendUserRegistrationEmail = require("../utils/EmailTemplate/UserRegistered");
const { commonResponse } = require("../utils/reponse/response");
const {
  validateSignup,
  validateSignin,
} = require("../utils/validators/fieldsValidator");
const {
  hashPassword,
  comparePassword,
} = require("../utils/validators/passwordHash");
const sendUserRegistrationEmailPI = require("../utils/EmailTemplate/UserRegisteredPI");
const sendVerificationEmail = require("../utils/EmailTemplate/EmailVerification");

function generateVerificationToken() {
  const length = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

exports.signup = async (req, res) => {
  const {
    first_name,
    last_name,
    email_address,
    password,
    mobile_number,
    role,
    gender,
    user_id,
  } = req.body;

  if (!validateSignup(req.body)) {
    return res.status(400).json(commonResponse("Fields are missing.", false));
  }

  const existingUser = await User.findOne({ email_address }).exec();
  if (existingUser) {
    return res.status(403).json(commonResponse("User already exists.", false));
  }

  const verificationToken = generateVerificationToken();

  const hashedPassword = await hashPassword(password);

  // Create a new user object with email verification token
  const newUser = new User({
    first_name,
    last_name,
    email_address,
    password: hashedPassword,
    mobile_number,
    role,
    gender,
    user_id,
    verification_token: verificationToken, // add this field to your User schema
    verification_token_expiry: Date.now() + 3600000, // token expiry in 1 hour
  });

  try {
    // Save the new user to the database
    const savedUser = await newUser.save();

    // console.log("69", savedUser);

    // Send an email with verification instructions
    sendVerificationEmail(
      savedUser.email_address,
      "Email verification OTP",
      verificationToken
    );

    res
      .status(201)
      .json(commonResponse("User created successfully", true, savedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json(commonResponse("Internal server error.", false));
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email_address, password } = req.body;
    // console.log(req.body)

    if (!validateSignin(req.body)) {
      throw new Error("Fields are missing.");
    }

    const user = await User.findOne({ email_address }).exec();
    // console.log(user)
    if (!user) {
      throw new Error("Email not registered. Please Sign Up. ");
    }

    if (!user.isVerified) {
      throw new Error("User is not verified. Please verify your account.");
    }

    const result = await comparePassword(password, user.password);

    if (!result) {
      throw new Error("Password is incorrect.");
    }

    const {
      _id,
      // email_address,
      first_name,
      last_name,
      role,
      mobile_number,
      profile_image,
      couponUsed,
    } = user;

    const Token = JWT.sign(
      {
        id: _id,
        // email_address,
        first_name,
        last_name,
        role,
        mobile_number,
        profile_image,
        couponUsed,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    const RefreshToken = JWT.sign(
      {
        id: _id,
        email_address,
        first_name,
        last_name,
        role,
        mobile_number,
        profile_image,
        couponUsed,
      },
      process.env.SECRET,
      {
        expiresIn: "10d",
      }
    );

    const data = {
      user: {
        _id,
        email_address,
        first_name,
        last_name,
        role,
        mobile_number,
        profile_image,
        couponUsed,
      },
      Token,
      RefreshToken,
    };

    res.status(200).json(commonResponse("sign-in successful", true, data));
  } catch (error) {
    res.status(401).json(commonResponse(error.message, false));
  }
};

const getfinalData = async (use) => {
  try {
    const allmonths = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    let result = [];

    allmonths.forEach((month) => {
      const item = use.find((item) => item.month === month);

      if (item) {
        result.push(item?.numberofdocuments);
      } else {
        result.push(0);
      }
    });

    return result;
  } catch (error) {
    // Handle any errors here, such as logging or rethrowing
    throw error;
  }
};

exports.userStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $match: {
          role: "user", // Add this $match stage to filter users by role
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          numberofdocuments: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: false,
          month: {
            $arrayElemAt: [
              [
                "",
                "january",
                "february",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december",
              ],
              "$_id.month",
            ],
          },
          numberofdocuments: true,
        },
      },
    ]);

    const result = await getfinalData(userStats);
    res.status(200).json(commonResponse("done", true, result));
  } catch (error) {
    res.status(500).json(commonResponse("An error occurred", false));
  }
};

exports.totalUsers = async (req, res) => {
  try {
    const data = await User.find({ role: "user" }).exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Users list fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No users found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    console.error(error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id) {
      return res.status(403).json(commonResponse("id not found"));
    }

    const hashedPassword = await hashPassword(password);

    const data = await User.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword }
    ).exec();

    if (data) {
      return res
        .status(200)
        .json(commonResponse("password changed", true, data));
    } else {
      return res
        .status(400)
        .json(commonResponse("password not changed", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    return res.status(500).json(commonResponse("An error occurred", false));
  }
};

exports.editUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email_address,
      mobile_number,
      role,
      id,
      user_id,
      contact_address,
    } = req.body;

    if (!id) {
      res.status(403).json(commonResponse("id not found", false));
      return;
    }

    const data = await User.findOneAndUpdate(
      { _id: id },
      {
        first_name: first_name,
        last_name: last_name,
        email_address: email_address,
        mobile_number: mobile_number,
        role: role,
        user_id: user_id,
        contact_address: contact_address,
      }
    ).exec();

    if (data) {
      res.status(200).json(commonResponse("user updated", true, data));
    } else {
      res.status(400).json(commonResponse("user not updated", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("An error occurred", false));
  }
};

exports.specificuser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("id not found");
    }

    const data = await User.findOne({ _id: id }).exec();

    if (data) {
      res.status(200).json(commonResponse("user found", true, data));
    } else {
      res.status(400).json(commonResponse("user not found", false));
    }
  } catch (error) {
    res.status(403).json(commonResponse(error.message));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    //console.log(id);

    const data = await User.deleteMany({ _id: { $in: id } }).exec();

    if (data.deletedCount > 0) {
      res.status(200).json(commonResponse("User deleted", true, data));
    } else {
      res
        .status(400)
        .json(commonResponse("User not found or not deleted", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { name, email, number, role, city, zipcode, createdAt } = req.query;

    const query = {
      ...(name && { first_name: { $regex: name, $options: "i" } }),
      ...(email && { email_address: { $regex: email, $options: "i" } }),
      ...(number && { mobile_number: { $regex: number, $options: "i" } }),
      ...(role && { role: { $regex: role, $options: "i" } }),
      ...(city && {
        contact_address: {
          $elemMatch: { town: { $regex: city, $options: "i" } },
        },
      }),
      ...(zipcode && {
        contact_address: {
          $elemMatch: { pincode: { $regex: zipcode, $options: "i" } },
        },
      }),
      ...(createdAt && { createdAt: { $regex: createdAt, $options: "i" } }),
    };

    const data = await User.find(query).exec();

    if (data) {
      res.status(200).json(commonResponse("users list fetched", true, data));
    } else {
      res.status(400).json(commonResponse("users not found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.CountUsers = async (req, res) => {
  try {
    const data = await User.find({ role: "user" }).count();

    if (data) {
      res.status(200).json(commonResponse("users count fetched", true, data));
    } else {
      res.status(400).json(commonResponse("users count not found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.Allusers = async (req, res) => {
  try {
    const { skip } = req.query;
    const data = await User.find({ role: "user" })
      .skip(skip ? parseInt(skip) : 0)
      .limit(10)
      .sort({ createdAt: -1 })
      .exec();

    if (data) {
      res.status(200).json(commonResponse("users list fetched", true, data));
    } else {
      res.status(400).json(commonResponse("users list not found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.AllAdminRoles = async (req, res) => {
  try {
    const { skip } = req.query;
    const data = await User.find({ role: { $ne: "user" } })
      .skip(skip ? parseInt(skip) : 0)
      .limit(10)
      .sort({ createdAt: -1 })
      .exec();

    if (data.length > 0) {
      res
        .status(200)
        .json(commonResponse("Non-user roles fetched", true, data));
    } else {
      res.status(404).json(commonResponse("Non-user roles not found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    console.error(error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.totalAdmin = async (req, res) => {
  try {
    const data = await User.find({ role: { $ne: "user" } }).exec();

    if (data.length > 0) {
      res.status(200).json(commonResponse("Admin list fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No admin found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    console.error(error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.CountAdmin = async (req, res) => {
  try {
    const data = await User.find({ role: { $ne: "user" } }).count();

    if (data) {
      res.status(200).json(commonResponse("users count fetched", true, data));
    } else {
      res.status(400).json(commonResponse("users count not found", false));
    }
  } catch (error) {
    // Handle any errors here, such as logging or sending an error response
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.verifyEmail = async (req, res) => {
  const { email_address, otp } = req.body;
  // const email_address = email;
  // console.log(req.body);

  try {
    const user = await User.findOne({ email_address }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordEntry = await User.findOne({
      email_address: user.email_address,
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!resetPasswordEntry || resetPasswordEntry.verification_token !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (resetPasswordEntry.verification_token_expiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateField = async (req, res) => {
  try {
    // Update all users to set isVerified to true
    const result = await User.updateMany({}, { $set: { isVerified: true } });

    res.status(200).json({
      success: true,
      message: `Updated ${result.nModified} users to add isVerified field.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.reVerifyEmail = async (req, res) => {
  const { email } = req.body;
  // console.log(email)

  try {
    const user = await User.findOne({ email_address: email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationToken = generateVerificationToken();

    // Assuming your User schema has a field named 'verification_token'
    user.verification_token = verificationToken;
    user.verification_token_expiry = Date.now() + 3600000;
    await user.save();

    sendVerificationEmail(
      user.email_address,
      "Email verification OTP",
      verificationToken
    );

    return res
      .status(200)
      .json({ message: "Verification token generated and sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateCouponCode = async (req, res) => {
  const { userId, couponCode } = req.body;
  // console.log(req.body);

  if (!userId || !couponCode) {
    return res
      .status(400)
      .json({ error: "userId and couponCode are required" });
  }

  try {
    const user = await User.findOneAndUpdate(
{_id: userId },
      { $addToSet: { couponUsed: couponCode } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Coupon added successfully", success: true });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the user",
      details: error,
    });
    // console.log(error);
  }
};
