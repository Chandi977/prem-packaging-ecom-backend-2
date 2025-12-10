const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
    },
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    model: {
      type: String,
    },
    size_inch: {
      type: String,
    },
    size_mm: {
      type: String,
    },
    flap_mm: {
      type: String,
    },
    thickness: {
      type: String,
    },
    thickness_micron:{
      type: Number,
    },
    pouch_weight: {
      type: String,
    },
    material: {
      type: String,
    },
    delivery_time: {
      type: String,
    },
    hsn_code: {
      type: String,
    },

   

    priceList: [
      {
        number: {
          type: Number,
        },
        MRP: {
          type: Number,
        },
        SP: {
          type: Number,
        },
        pack_weight: {
          type: Number,
        },
        stock_quantity: {
          type: Number,
        }
      },
    ],

    gst: {
      type: Number,
    },

    price: {
      type: Number,
    },

    gusset: {
      type: String,
    },
    print: {
      type: String,
    },
    label_in_roll: {
      type: Number,
    },
    color: {
      type: String,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    breadth_inch: {
      type: Number,
    },
    breadth_mm: {
      type: Number,
    },
    height_inch: {
      type: Number,
    },
    height_mm: {
      type: Number,
    },
    meta_title: {
      type: String,
    },
    meta_description: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategories",
    },
    images: [
      {
        image: {
          type: String,
        },
      },
    ],
    description: {
      type: String,
    },
    product_id: {
      type: String,
    },
    top_product: {
      type: Boolean,
      default: false,
    },
    deal_product:{
      type:Boolean,
      default:false,
    },
    length_inch: {
      type: Number,
    },
    length_mm: {
      type: Number,
    },
    thick_mic:{
      type: Number,
    },
    usage:{
      type: String
    },
    aboutItem: {
      type: String,
    },
    buyItWith: [
      {
        type: {
          type: String 
        }
      }
    ],
    relatedProducts: [
      {
        type: {
          type: String 
        }
      }
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
