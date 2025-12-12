// controllers/productController.js
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const fs = require("fs");
const csv = require("csv-parser");
const { validateProduct } = require("../utils/validators/fieldsValidator");
const Product = require("../models/product");
const Notify = require("../models/notify");
const slugify = require("slugify");
const { commonResponse } = require("../utils/reponse/response");
const sendNotifyEmail = require("../utils/EmailTemplate/NotifyEmail");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// concurrency limiter to avoid AWS throttling when many presigned urls
const pLimit = require("p-limit");

// --- Config & single S3 client (reused) ---
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_BUCKET_REGION || "ap-south-1";
const bucketName = process.env.AWS_BUCKET_NAME;

// Single S3 client used for both presign and put operations
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
});

// Helper: build public S3 URL (keeps your current public-read approach)
const buildPublicUrl = (key) =>
  `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;

// --- makeCall: returns presigned URL for a single key ---
// We keep this function for backward compatibility (some endpoints might expect presigned URL).
// It uses the shared s3Client. It no longer recreates the client each invocation.
const makeCall = async (imageKey, expiresIn = 3600) => {
  if (!imageKey) return null;
  try {
    const params = { Bucket: bucketName, Key: imageKey };
    const command = new GetObjectCommand(params);
    // generate presigned URL
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (err) {
    console.error("makeCall error for key:", imageKey, err);
    // Fallback: return public url if presign fails
    return buildPublicUrl(imageKey);
  }
};

// --- remove this line if present ---
// const pLimit = require("p-limit");

// --- small concurrency runner (no external deps) ---
// runs an array of async tasks (functions returning promises) with concurrency limit
const runWithConcurrency = async (taskFns = [], concurrency = 10) => {
  const results = new Array(taskFns.length);
  let inFlight = 0;
  let idx = 0;

  return new Promise((resolve, reject) => {
    const launchNext = () => {
      // finished all
      if (idx >= taskFns.length && inFlight === 0) return resolve(results);

      while (inFlight < concurrency && idx < taskFns.length) {
        const currentIndex = idx++;
        inFlight++;

        // call the task function
        taskFns[currentIndex]()
          .then((r) => {
            results[currentIndex] = r;
          })
          .catch((err) => {
            // capture error result and continue (so one failure doesn't break everything)
            results[currentIndex] = { error: String(err) };
            console.error("task error:", err);
          })
          .finally(() => {
            inFlight--;
            launchNext();
          });
      }
    };

    // early resolve for empty
    if (taskFns.length === 0) return resolve(results);
    launchNext();
  });
};

// --- updated processImages using runWithConcurrency ---
const processImages = async (features = [], options = {}) => {
  if (!features || features.length === 0) return features;

  const concurrency = options.concurrency || 10;
  const expiresIn = options.expiresIn || 3600;

  // create task functions for each image element
  const taskFns = features.map((feat) => async () => {
    try {
      const key = typeof feat === "string" ? feat : feat.image;
      if (!key)
        return typeof feat === "string"
          ? { image: null }
          : { ...feat, image: null };

      // try presigned url (keeps original logic), fallback to public url
      const signed = await makeCall(key, expiresIn);
      if (typeof feat === "string")
        return { image: signed || buildPublicUrl(key) };
      return { ...feat, image: signed || buildPublicUrl(key) };
    } catch (err) {
      console.error("processImages item error:", err);
      const key = typeof feat === "string" ? feat : feat.image;
      return typeof feat === "string"
        ? { image: buildPublicUrl(key) }
        : { ...feat, image: buildPublicUrl(key) };
    }
  });

  // run tasks with concurrency limit
  const processed = await runWithConcurrency(taskFns, concurrency);

  // processed is an array of objects in same order as features
  return processed;
};

// -------------------- Exported endpoints --------------------

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(commonResponse("File is required", false));
    }

    const params = {
      Bucket: bucketName, // use env bucket
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = buildPublicUrl(req.file.originalname);

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

    const url = buildPublicUrl(image);

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

    // keep exact count as before
    const totalProducts = await Product.countDocuments();

    // use .lean() to reduce overhead and speed up serialization
    let products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("brand category sub_category")
      .lean()
      .exec();

    // Process images in parallel across products (instead of sequentially)
    const productImagePromises = products.map(async (prod) => {
      if (prod?.images && prod.images.length > 0) {
        const result = await processImages(prod.images);
        prod.images = result;
      }
      return prod;
    });

    await Promise.all(productImagePromises);

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

    try {
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
              const emailAddresses = notifications.map(
                (notification) => notification.email_address
              );

              sendNotifyEmail(emailAddresses, "Product back in Stock", data);

              const notificationIds = notifications.map(
                (notification) => notification._id
              );
              await Notify.updateMany(
                { _id: { $in: notificationIds } },
                { $set: { mail_sent: true } }
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error occurred while checking stock quantity:", error);
    }

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
    console.error(error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.body;

  try {
    const data = await Product.deleteMany({ _id: { $in: id } }).exec();

    if (data.deletedCount > 0) {
      res.status(200).json(commonResponse("Products deleted", true, data));
    } else {
      res
        .status(404)
        .json(commonResponse("No products found for deletion", false));
    }
  } catch (error) {
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
    const searchQuery = req.body.search;
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

    // process images in parallel for all products
    const proms = data.map(async (p) => {
      if (p.images && p.images.length > 0) {
        const result = await processImages(p.images);
        p.images = result;
      }
      return p;
    });
    await Promise.all(proms);

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
    console.error("Error while counting products:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { length, breadth, height, category, brand, subcategory, q, unit } =
      req.body;

    let dimensionField;
    if (unit === "inches") {
      dimensionField = {
        length: "length_inch",
        breadth: "breadth_inch",
        height: "height_inch",
      };
    } else {
      dimensionField = {
        length: "length_mm",
        breadth: "breadth_mm",
        height: "height_mm",
      };
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

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      const proms = data.map(async (d) => {
        if (d?.images?.length > 0) {
          const result = await processImages(d?.images);
          d.images = result;
        }
        return d;
      });
      await Promise.all(proms);

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

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      const proms = data.map(async (d) => {
        if (d?.images?.length > 0) {
          const result = await processImages(d?.images);
          d.images = result;
        }
        return d;
      });
      await Promise.all(proms);

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
    const { length, breadth, category, brand, subcategory, q, unit } = req.body;

    let dimensionField;

    if (unit === "inches") {
      dimensionField = {
        length: "length_inch",
        breadth: "breadth_inch",
      };
    } else {
      dimensionField = {
        length: "length_mm",
        breadth: "breadth_mm",
      };
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

    const data = await Product.find(filter).sort({ _id: 1 }).exec();

    if (data && data.length > 0) {
      const proms = data.map(async (d) => {
        if (d?.images?.length > 0) {
          const result = await processImages(d?.images);
          d.images = result;
        }
        return d;
      });
      await Promise.all(proms);

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
      const proms = data.map(async (d) => {
        if (d?.images?.length > 0) {
          const result = await processImages(d?.images);
          d.images = result;
        }
        return d;
      });
      await Promise.all(proms);

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
    const data = await Product.findOne({ _id: id }).populate("brand").exec();

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product found", data });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.SingleProductWithImage = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Product.findOne({ _id: id }).populate("brand").exec();

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    const image = await processImages(data?.images);
    data.images = image;

    res.status(200).json({ message: "Product found", data });
  } catch (error) {
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
        for (const row of results) {
          const product = new Product({ ...row });
          await product.save();
        }
        res.json({ message: "CSV file uploaded successfully" });
      });
  } catch (error) {
    console.error("Error uploading CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
