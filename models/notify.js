const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    name: {
      type: String,
    },
    email_address: {
      type: String,
    },
    mobile_number: {
      type: String,
    },
    mail_sent: {
      type: Boolean,
      default: false,
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notify", notifySchema);
