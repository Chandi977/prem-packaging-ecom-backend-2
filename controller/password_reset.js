const resetPasswordModel = require("../models/password_reset");
const User = require("../models/user");
const { hashPassword } = require("../utils/validators/passwordHash");
const sendForgetPasswordEmail = require("../utils/EmailTemplate/ForgetPassword");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const email_address = email;

  try {
    const user = await User.findOne({ email_address }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const generateOTP = () => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString();
    };

    const otp = generateOTP();

    const resetPasswordEntry = new resetPasswordModel({
      user_id: user._id,
      otp: otp,
      expires_at: new Date(Date.now() + 600000),
    });

    await resetPasswordEntry.save();
    sendForgetPasswordEmail(
        email_address,
        "Password Reset OTP",
        otp
      );
    //   console.log("Email sent");

    return res.status(200).json({ message: "OTP generated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const email_address = email;

  try {
    const user = await User.findOne({ email_address }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordEntry = await resetPasswordModel
      .findOne({ user_id: user._id })
      .sort({ createdAt: -1 })
      .exec();

    if (!resetPasswordEntry || resetPasswordEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (resetPasswordEntry.expires_at < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email_address, new_password, confirm_password } = req.body;
  //console.log("new-password",new_password );

  try {
    const user = await User.findOne({ email_address }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await hashPassword(new_password);

    user.password = hashedPassword;
    await user.save();

    await resetPasswordModel.deleteOne({ user_id: user._id });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
