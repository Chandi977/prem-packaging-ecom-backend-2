const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    category_id: {
      type: String,
    },
    meta_title: {
      type: String,
    },
    meta_description: {
      type: String,
    },
    image: {
      type: String,
    },
    subCategories:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategories",
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
