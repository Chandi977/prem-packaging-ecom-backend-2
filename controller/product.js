require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const { validateProduct } = require("../utils/validators/fieldsValidator");
const Product = require("../models/product");
const Notify = require("../models/notify");
const slugify = require("slugify");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const { commonResponse } = require("../utils/reponse/response");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sendNotifyEmail = require("../utils/EmailTemplate/NotifyEmail");
require("dotenv").config();
// Auth

const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

const makeCall = async (image) => {
  s3 = new S3Client({
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    },
    region: "ap-south-1",
  });
  const par = {
    Bucket: "prem-industries-ecom-images",
    Key: image,
  };
  const command = new GetObjectCommand(par);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

const processImages = async (features) => {
  let result;
  let temp = features;
  for (let i = 0; i < features?.length; i++) {
    result = await makeCall(features[i]?.image);
    temp[i]["image"] = result;
  }
  return temp;
};

exports.uploadImage = async (req, res) => {
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
      region: region,
    });

    const params = {
      Bucket: bucketName, // use env bucket
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${req.file.originalname}`;

    return res.status(201).json(
      commonResponse("image uploaded", true, {
        url,
        key: req.file.originalname,
      })
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json(commonResponse("Error uploading image", false));
  }
};

exports.getImage = async (req, res) => {
  try {
    const { image } = req.query; // image = key / filename in S3
    if (!image) {
      return res
        .status(400)
        .json(commonResponse("Image key is required", false));
    }

    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${image}`;

    return res.status(200).json(commonResponse("Image fetched", true, { url }));
  } catch (error) {
    console.error("Error in getImage:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      brand,
      name,
      model,
      size_inch,
      size_mm,
      flap_mm,
      thickness,
      thickness_micron,
      pouch_weight,
      material,
      delivery_time,
      hsn_code,
      price,
      priceList,
      gst,
      gusset,
      print,
      label_in_role,
      color,
      length,
      width,
      breadth_inch,
      breadth_mm,
      height_inch,
      height_mm,
      meta_title,
      meta_description,
      category,
      sub_category,
      images,
      product_id,
      length_mm,
      length_inch,
      description,
      usage,
      slug,
      aboutItem,
    } = req.body;

    if (!validateProduct(req.body)) {
      return res.status(400).json(commonResponse("Invalid fields", false));
    }

    const product = new Product({
      brand,
      name,
      model,
      size_inch,
      size_mm,
      flap_mm,
      thickness,
      thickness_micron,
      pouch_weight,
      material,
      delivery_time,
      hsn_code,
      price,
      gst,
      gusset,
      print,
      label_in_role,
      color,
      length,
      width,
      breadth_inch,
      breadth_mm,
      height_inch,
      height_mm,
      meta_title,
      meta_description,
      category,
      sub_category,
      images,
      slug,
      product_id,
      priceList,
      length_mm,
      length_inch,
      description,
      usage,
      aboutItem,
    });

    // Save the product to the database
    const data = await product.save();

    // Check if the product was saved successfully
    if (data) {
      return res
        .status(201)
        .json(commonResponse("Product created successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Product not created", false));
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating product:", error);
    return res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log("204", req.params);
    const data = await Product.findOne({ _id: id }).populate("brand").exec();

    if (!data) {
      return res.status(404).json(commonResponse("Product not found", false));
    }

    const image = await processImages(data?.images);
    data.images = image;

    res.status(200).json(commonResponse("Product found", true, data));
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log("slug:", slug); auth

    const slugPattern = new RegExp(
      `^${slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}$`,
      "i"
    );

    const data = await Product.findOne({
      slug: { $regex: slugPattern },
    }).populate("brand");

    if (!data) {
      return res.status(404).json(commonResponse("Product not found", false));
    }

    const image = await processImages(data?.images);
    data.images = image;

    res.status(200).json(commonResponse("Product found", true, data));
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    let products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("brand category sub_category")
      .exec();

    // Process images
    for (let i = 0; i < products.length; i++) {
      if (products[i]?.images?.length > 0) {
        const result = await processImages(products[i].images);
        products[i].images = result;
      }
    }

    // 🔥 RETURN ONLY ARRAY + TOTAL — NO PAGINATION OBJECT!
    return res.status(200).json({
      success: true,
      message: "Products found",
      total: totalProducts,
      data: products, // 👈 THIS MUST BE ONLY THE ARRAY
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
};

exports.updateProduct = async (req, res) => {
  const existingProduct = await Product.findById(req.body.id).exec();

  try {
    const {
      id,
      brand,
      name,
      model,
      size_inch,
      size_mm,
      flap_mm,
      thickness,
      thickness_micron,
      pouch_weight,
      material,
      delivery_time,
      hsn_code,
      price,
      priceList,
      gst,
      gusset,
      print,
      label_in_role,
      color,
      length,
      width,
      slug,
      breadth_inch,
      breadth_mm,
      height_inch,
      height_mm,
      meta_title,
      meta_description,
      category,
      sub_category,
      images,
      product_id,
      description,
      usage,
      top_product,
      deal_product,
      buyItWith,
      relatedProducts,
    } = req.body;

    // console.log(req.body);

    // Update the product using async/await
    const productUpdate = {
      brand,
      name,
      model,
      size_inch,
      size_mm,
      flap_mm,
      thickness,
      thickness_micron,
      pouch_weight,
      material,
      delivery_time,
      hsn_code,
      price,
      gst,
      gusset,
      print,
      label_in_role,
      color,
      length,
      width,
      breadth_inch,
      breadth_mm,
      height_inch,
      height_mm,
      meta_title,
      meta_description,
      category,
      sub_category,
      images,
      slug,
      product_id,
      description,
      usage,
      top_product,
      deal_product,
      buyItWith,
      relatedProducts,
    };

    const data = await Product.findOneAndUpdate(
      { _id: id },
      { $set: productUpdate },
      { new: true }
    ).exec();
    // console.log(data);
    // Update the priceList separately

    try {
      // Check if data and priceList exist and the first element of priceList contains stock_quantity
      if (
        data &&
        priceList &&
        Array.isArray(priceList) &&
        priceList.length > 0 &&
        priceList[0].hasOwnProperty("stock_quantity")
      ) {
        if (
          existingProduct.priceList &&
          existingProduct.priceList.length > 0 &&
          priceList &&
          priceList.length > 0 &&
          existingProduct.priceList[0].stock_quantity === 0 &&
          priceList[0].stock_quantity > 0
        ) {
          const existingStockQuantity =
            existingProduct.priceList[0].stock_quantity;
          const newStockQuantity = priceList[0].stock_quantity;
          if (existingStockQuantity <= 0) {
            const notifications = await Notify.find({
              product_id: id,
              mail_sent: false,
            });

            if (notifications.length > 0) {
              // Extract email addresses from fetched data
              const emailAddresses = notifications.map(
                (notification) => notification.email_address
              );

              // Send notification emails
              sendNotifyEmail(emailAddresses, "Product back in Stock", data);

              // Update notifications to set mail_sent to true
              const notificationIds = notifications.map(
                (notification) => notification._id
              );
              await Notify.updateMany(
                { _id: { $in: notificationIds } },
                { $set: { mail_sent: true } }
              );

              // console.log("Emails sent and notifications updated successfully");
            } else {
              // console.log("No pending notifications to send");
            }

            // console.log(
            //   `Change in stock quantity detected: ${existingStockQuantity} -> ${newStockQuantity}`
            // );
          }
        } else {
          // console.log("stock quantity greater than zero or no change");
        }
      } else {
        // console.log("Data or price list is missing or incorrectly formatted.");
      }
    } catch (error) {
      console.error("Error occurred while checking stock quantity:", error);
    }

    //console.log("check 2");

    if (data) {
      const priceListUpdate = await Product.updateOne(
        { _id: id },
        { $set: { priceList } }
      ).exec();

      if (priceListUpdate) {
        res.status(200).json(commonResponse("Product updated", true, data));
      } else {
        res.status(400).json(commonResponse("PriceList not updated", false));
      }
    } else {
      res.status(400).json(commonResponse("Product not updated", false));
    }
  } catch (error) {
    // Handle any errors that occur during the update operation
    console.error(error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.body;

  try {
    // Use the 'deleteMany' method to delete products by their IDs
    const data = await Product.deleteMany({ _id: { $in: id } }).exec();

    if (data.deletedCount > 0) {
      res.status(200).json(commonResponse("Products deleted", true, data));
    } else {
      res
        .status(404)
        .json(commonResponse("No products found for deletion", false));
    }
  } catch (error) {
    // Handle any errors that may occur during the deletion process
    console.error("Error deleting products:", error);
    res.status(500).json(commonResponse("Error deleting products", false));
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const { name, product_id, slug, model } = req.query;
    const filter = {
      ...(name && { name: { $regex: name, $options: "i" } }),
      ...(product_id && { product_id: product_id }),
      ...(slug && { slug: { $regex: slug, $options: "i" } }),
      ...(model && { model: { $regex: model, $options: "i" } }),
    };

    const data = await Product.find(filter).exec();

    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Products fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No Products found", false));
    }
  } catch (error) {
    console.error("Error fetching Products: ", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.searchMainProducts = async (req, res) => {
  try {
    const searchQuery = req.body.search; // Assuming the search characters are sent as 'search' in the request query
    //console.log(searchQuery);
    const filter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { product_id: searchQuery },
        { slug: { $regex: searchQuery, $options: "i" } },
        { model: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const data = await Product.find(filter).exec();

    if (data && data.length > 0) {
      res.status(200).json(commonResponse("Products fetched", true, data));
    } else {
      res.status(404).json(commonResponse("No Products found", false));
    }
  } catch (error) {
    console.error("Error fetching Products: ", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.allProducts = async (req, res) => {
  try {
    const data = await Product.find()
      .sort({ _id: 1 })
      .populate("category brand")
      .exec();

    if (!data || data.length === 0) {
      return res.status(404).json(commonResponse("Products not found", false));
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].images && data[i].images.length > 0) {
        const result = await processImages(data[i].images);
        data[i].images = result;
      }
    }

    res.status(200).json(commonResponse("Products found", true, data));
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.countProducts = async (req, res) => {
  try {
    const data = await Product.countDocuments().exec();

    if (data !== null) {
      res.status(200).json(commonResponse("Products found", true, data));
    } else {
      res.status(404).json(commonResponse("Products not found", false));
    }
  } catch (error) {
    // Handle the error gracefully
    console.error("Error while counting products:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { length, breadth, height, category, brand, subcategory, q, unit } =
      req.body;
    //console.log(req.body);

    let dimensionField;
    let unitField;

    if (unit === "inches") {
      dimensionField = {
        length: "length_inch",
        breadth: "breadth_inch",
        height: "height_inch",
      };
      unitField = "inches";
    } else {
      dimensionField = {
        length: "length_mm",
        breadth: "breadth_mm",
        height: "height_mm",
      };
      unitField = "mm";
    }

    const filter = {
      ...(length && {
        [dimensionField.length]: {
          $gte: length.min.toString(),
          $lte: length.max.toString(),
        },
      }),
      ...(breadth && {
        [dimensionField.breadth]: {
          $gte: breadth.min.toString(),
          $lte: breadth.max.toString(),
        },
      }),
      ...(height && {
        [dimensionField.height]: {
          $gte: height.min.toString(),
          $lte: height.max.toString(),
        },
      }),
      ...(category?.length > 0 && { category: { $in: category } }),
      ...(brand?.length > 0 && { brand: { $in: brand } }),
      ...(subcategory && { sub_category: subcategory }),
      ...(q && { name: { $regex: q, $options: "i" } }),
    };

    //console.log("538", filter);

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.images?.length > 0) {
          const result = await processImages(data[i]?.images);
          data[i]["images"] = result;
        }
      }
      res.status(200).json(commonResponse("Products found", true, data));
    } else {
      res.status(404).json(commonResponse("Products not found", false));
    }
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.filterBoppProducts = async (req, res) => {
  try {
    const { length, width, thickness, category, brand, subcategory, q } =
      req.body;
    //console.log("552", req.body);

    let lenMin, lenMax, widMin, widMax, thickMin, thickMax;

    if (length) {
      lenMin = parseFloat(length.min);
      lenMax = parseFloat(length.max);
    }
    if (width) {
      widMin = parseFloat(width.min);
      widMax = parseFloat(width.max);
    }
    if (thickness) {
      thickMin = parseFloat(thickness.min);
      thickMax = parseFloat(thickness.max);
    }

    // const categoryFilter = { category: "6557df64301ec4f2f4266141" };

    const filter = {
      ...(length && { length: { $gte: lenMin, $lte: lenMax } }),
      ...(width && { breadth_mm: { $gte: widMin, $lte: widMax } }),
      ...(thickness && {
        thickness_micron: { $gte: thickMin, $lte: thickMax },
      }),
      ...(category?.length > 0 && { category: { $in: category } }),
      ...(brand?.length > 0 && { brand: { $in: brand } }),
      ...(subcategory && { sub_category: subcategory }),
      ...(q && { name: { $regex: q, $options: "i" } }),
    };
    //console.log("579", filter);

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    // console.log("582", data);

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.images?.length > 0) {
          const result = await processImages(data[i]?.images);
          data[i]["images"] = result;
        }
      }
      res.status(200).json(commonResponse("Products found", true, data));
    } else {
      res.status(404).json(commonResponse("Products not found", false));
    }
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.filterLabelProducts = async (req, res) => {
  try {
    const { length, breadth, height, category, brand, subcategory, q, unit } =
      req.body;
    //console.log(req.body);

    let dimensionField;
    let unitField;

    if (unit === "inches") {
      dimensionField = {
        length: "length_inch",
        breadth: "breadth_inch",
      };
      unitField = "inches";
    } else {
      dimensionField = {
        length: "length_mm",
        breadth: "breadth_mm",
      };
      unitField = "mm";
    }

    const filter = {
      ...(length && {
        [dimensionField.length]: {
          $gte: length.min.toString(),
          $lte: length.max.toString(),
        },
      }),
      ...(breadth && {
        [dimensionField.breadth]: {
          $gte: breadth.min.toString(),
          $lte: breadth.max.toString(),
        },
      }),
      ...(category?.length > 0 && { category: { $in: category } }),
      ...(brand?.length > 0 && { brand: { $in: brand } }),
      ...(subcategory && { sub_category: subcategory }),
      ...(q && { name: { $regex: q, $options: "i" } }),
    };

    //console.log("538", filter);

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.images?.length > 0) {
          const result = await processImages(data[i]?.images);
          data[i]["images"] = result;
        }
      }
      res.status(200).json(commonResponse("Products found", true, data));
    } else {
      res.status(404).json(commonResponse("Products not found", false));
    }
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.filterPolyProducts = async (req, res) => {
  try {
    const { width, breadth, category, brand, subcategory, q } = req.body;
    let wiMin;
    let wiMax;
    let brMin;
    let brMax;

    if (width) {
      wiMin = width.min;
      wiMin = wiMin.toString();
      wiMax = width.max;
      wiMax = wiMax.toString();
    }
    if (breadth) {
      brMin = breadth.min;
      brMin = brMin.toString();
      brMax = breadth.max;
      brMax = brMax.toString();
    }

    const filter = {
      ...(width && { length_inch: { $gte: wiMin, $lte: wiMax } }),
      ...(breadth && { breadth_inch: { $gte: brMin, $lte: brMax } }),
      ...(category?.length > 0 && { category: { $in: category } }),
      ...(brand && { brand: brand }),
      ...(subcategory && { sub_category: subcategory }),
      ...(q && { name: { $regex: q, $options: "i" } }),
    };

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.images?.length > 0) {
          const result = await processImages(data[i]?.images);
          data[i]["images"] = result;
        }
      }
      res.status(200).json(commonResponse("Products found", true, data));
    } else {
      res.status(404).json(commonResponse("Products not found", false));
    }
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json(commonResponse("Internal Server Error", false));
  }
};

exports.SingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to find the product by ID and populate the 'brand' field
    const data = await Product.findOne({ _id: id }).populate("brand").exec();

    if (!data) {
      // If no product is found, send a 404 (Not Found) response
      return res.status(404).json({ message: "Product not found" });
    }

    // const image = await processImages(data?.images);
    // data.images = image;

    // If a product is found, send a 200 (OK) response
    res.status(200).json({ message: "Product found", data });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.SingleProductWithImage = async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to find the product by ID and populate the 'brand' field
    const data = await Product.findOne({ _id: id }).populate("brand").exec();

    if (!data) {
      // If no product is found, send a 404 (Not Found) response
      return res.status(404).json({ message: "Product not found" });
    }

    const image = await processImages(data?.images);
    data.images = image;

    // If a product is found, send a 200 (OK) response
    res.status(200).json({ message: "Product found", data });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Process the CSV data and save to the database
        for (const row of results) {
          const product = new Product({ ...row });
          await product.save();
        }
        res.json({ message: "CSV file uploaded successfully" });
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
