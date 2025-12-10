const { commonResponse, returnjson } = require("../utils/reponse/response");
const Cart = require("../models/cart");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
// Auth

const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

const makecall = async (image) => {
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
// console.log("20", par);

  const command = new GetObjectCommand(par);
  const url = await getSignedUrl(s3, command, { expiresIn: 86400 });
// console.log("24", url);
  return url;
};

const processimagess = async (features) => {
  let result;
  let temp = features;
  // console.log("28", features);
  for (let i = 0; i < features?.length; i++) {
    result = await makecall(features[i]?.image);
    temp[i]["image"] = result;
  }
  return temp;
};

const pro = async (features, imu) => {
  let result;
  let temp = features;
  for (let i = 0; i < features?.length; i++) {
    result = await makecall(imu[i]);
    temp[i]["tyre"]["tyre_manufacturer"]["image"] = result;
  }
  return temp;
};

exports.AddtoCart = async (req, res) => {
  const { product, user } = req.body;

  try {
    const cart = await Cart.findOne({ user: user }).exec();

    if (!cart) {
      // If the cart doesn't exist, create a new one
      const newCart = new Cart({
        products: [product],
        user,
        total_amount: Number(product?.price) * Number(product?.quantity),
        tax_amount: 0,
        discount_amount: 0,
        totalPackWeight: Number(product?.totalPackWeight) || 0,
        packSize: Number(product?.packSize),
      });

      const createdCart = await newCart.save();
      res
        .status(201)
        .json(commonResponse("Item added to the cart", true, createdCart));
    } else {
      // If the cart already exists
      const products = returnjson(cart?.products);
      const productIndex = products.findIndex(
        (x) => x.product === product.product && x.packSize === product.packSize
      );

      if (productIndex === -1) {
        // If the product with the same pack size is not in the cart, add it
        const tempProducts = [...products, product];

        // Calculate totals
        const total_amount = tempProducts.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
        const totalPackWeight = tempProducts.reduce(
          (acc, curr) => acc + (curr.totalPackWeight || 0),
          0
        );
        const packSize = tempProducts.reduce(
          (acc, curr) => acc + (curr.packSize || 0),
          0
        );

        const updated = await Cart.findOneAndUpdate(
          { user: user },
          {
            products: tempProducts,
            total_amount,
            totalPackWeight,
            packSize,
            discount_amount: 0,
            appliedCoupon: false,
            couponType: "",
            appliedCouponName: "",
            $unset: {
              totalDiscountPercentage: "",
              maxCapDiscount: "",
              totalDiscountPrice: "",
              shippingDiscountPrice: "",
              shippingDiscountPercentage: "",
            },
          },
          { new: true }
        ).exec();

        res
          .status(201)
          .json(commonResponse("Item added to the cart", true, updated));
      } else {
        // If the product with the same pack size is already in the cart, update quantity and pack weight
        const existingProduct = products[productIndex];

        // Update quantity and pack weight
        const newQuantity = existingProduct.quantity + product.quantity;

        // Check if updated quantity exceeds stock
        if (newQuantity > product.stock) {
          return res
            .status(400)
            .json(commonResponse("Quantity exceeds available stock", false));
        }

        existingProduct.quantity = newQuantity;
        existingProduct.totalPackWeight =
          (existingProduct.totalPackWeight || 0) +
          (product.totalPackWeight || 0);

        // Calculate totals
        const total_amount = products.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
        const totalPackWeight = products.reduce(
          (acc, curr) => acc + (curr.totalPackWeight || 0),
          0
        );
        const packSize = products.reduce(
          (acc, curr) => acc + (curr.packSize || 0),
          0
        );

        const updated = await Cart.findOneAndUpdate(
          { user: user },
          {
            products,
            total_amount,
            totalPackWeight,
            packSize,
            discount_amount: 0,
            appliedCoupon: false,
            couponType: "",
            appliedCouponName: "",
            $unset: {
              totalDiscountPercentage: "",
              maxCapDiscount: "",
              totalDiscountPrice: "",
              shippingDiscountPrice: "",
              shippingDiscountPercentage: "",
            },
          },
          { new: true }
        ).exec();

        res
          .status(201)
          .json(commonResponse("Item updated in the cart", true, updated));
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(commonResponse("Something went wrong in updating", false));
  }
};

exports.alterQuantity = async (req, res) => {
  const { product, user, quantity } = req.body;
  //console.log(req.body)
  const cart = await Cart.findOne({ user: user }).exec();
  const products = returnjson(cart?.products);
  const index = products?.map((x) => x.product).indexOf(product);
  if (index === -1) {
    res.status(403).json(commonResponse("product not found", false));
  } else {
    let finalProduct;
    products[index]["quantity"] = quantity;
    finalProduct = products;
    const total_amount = finalProduct.reduce((curr, acc) => {
      return curr + acc.price * acc.quantity;
    }, 0);
    const data = await Cart.findOneAndUpdate(
      { user: user },
      {
        products: finalProduct,
        total_amount,
      },
      {
        new: true,
      }
    ).exec();
    if (data) {
      res.status(201).json(commonResponse("quantity updated", true, data));
    } else {
      res.status(500).json(commonResponse("something went wrong", false));
    }
  }
};

exports.updateCart = async (req, res) => {
  try {
    const {
      user,
      products,
      appliedCoupon,
      appliedCouponName,
      couponType,
      maxCapDiscount,
      couponUse,
    } = req.body;
    // console.log(req.body);
    // Check if all required fields are present
    if (!user || !products || !Array.isArray(products)) {
      return res
        .status(400)
        .json(commonResponse("Invalid request format", false));
    }

    const cart = await Cart.findOne({ user }).exec();
    if (!cart) {
      return res
        .status(403)
        .json(commonResponse("Cart not found for the user", false));
    }

    // Iterate through the products array and update them in the cart
    for (const update of products) {
      const { product, discountPrice } = update;

      const index = cart.products.findIndex(
        (p) => p.product.toString() === product
      );
      if (index !== -1) {
        cart.products[index].discountPrice = discountPrice;
      }
    }

    // Calculate total amount considering both updated and not updated products
    let total_amount = 0;
    for (const product of cart.products) {
      // Check if discount price is available, use it; otherwise, use the original price
      const price =
        product.discountPrice > 0 ? product.discountPrice : product.price;
      total_amount += price * product.quantity;
    }

    // Update the cart with the updated products and total_amount
    const updatedCart = await Cart.findOneAndUpdate(
      { user },
      {
        products: cart.products,
        total_amount,
        appliedCoupon,
        appliedCouponName,
        couponType,
        maxCapDiscount,
        couponUse,
      },
      { new: true }
    ).exec();

    if (updatedCart) {
      //console.log("Updated Cart:", updatedCart); // Log the updated cart
      res
        .status(201)
        .json(commonResponse("Cart updated successfully", true, updatedCart));
    } else {
      res
        .status(500)
        .json(
          commonResponse("Something went wrong while updating the cart", false)
        );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.updateShippingCoupon = async (req, res) => {
  try {
    const {
      user,
      appliedCoupon,
      shippingDiscountPrice,
      shippingDiscountPercentage,
      appliedCouponName,
      couponType,
      maxCapDiscount,
      couponUse,
    } = req.body;

    // Check if all required fields are present
    if (!user) {
      return res
        .status(400)
        .json(commonResponse("Invalid request format", false));
    }

    const cart = await Cart.findOne({ user }).exec();
    if (!cart) {
      return res
        .status(403)
        .json(commonResponse("Cart not found for the user", false));
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user },
      {
        shippingDiscountPercentage,
        shippingDiscountPrice,
        appliedCoupon,
        appliedCouponName,
        couponType,
        maxCapDiscount,
        couponUse,
      },
      { new: true }
    ).exec();

    if (updatedCart) {
      //console.log("Updated Cart:", updatedCart); // Log the updated cart
      res
        .status(201)
        .json(commonResponse("Cart updated successfully", true, updatedCart));
    } else {
      res
        .status(500)
        .json(
          commonResponse("Something went wrong while updating the cart", false)
        );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.updateAllDiscount = async (req, res) => {
  try {
    const {
      user,
      appliedCoupon,
      totalDiscountPrice,
      totalDiscountPercentage,
      appliedCouponName,
      maxCapDiscount,
      couponType,
      couponUse,
    } = req.body;
    //console.log(req.body);
    // Check if all required fields are present
    if (!user) {
      return res
        .status(400)
        .json(commonResponse("Invalid request format", false));
    }

    const cart = await Cart.findOne({ user }).exec();
    if (!cart) {
      return res
        .status(403)
        .json(commonResponse("Cart not found for the user", false));
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user },
      {
        totalDiscountPrice,
        totalDiscountPercentage,
        appliedCoupon,
        appliedCouponName,
        maxCapDiscount,
        couponType,
        couponUse,
      },
      { new: true }
    ).exec();

    if (updatedCart) {
      //console.log("Updated Cart:", updatedCart); // Log the updated cart
      res
        .status(201)
        .json(commonResponse("Cart updated successfully", true, updatedCart));
    } else {
      res
        .status(500)
        .json(
          commonResponse("Something went wrong while updating the cart", false)
        );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.updateProductTypeAllCoupon = async (req, res) => {
  try {
    const {
      user,
      appliedCoupon,
      appliedCouponName,
      discount_amount,
      couponType,
      maxCapDiscount,
      couponUse,
    } = req.body;
    //console.log(req.body);
    // Check if all required fields are present
    if (!user) {
      return res
        .status(400)
        .json(commonResponse("Invalid request format", false));
    }

    const cart = await Cart.findOne({ user }).exec();
    if (!cart) {
      return res
        .status(403)
        .json(commonResponse("Cart not found for the user", false));
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user },
      {
        appliedCoupon,
        appliedCouponName,
        discount_amount,
        maxCapDiscount,
        couponUse,
      },
      { new: true }
    ).exec();

    if (updatedCart) {
      //console.log("Updated Cart:", updatedCart); // Log the updated cart
      res
        .status(201)
        .json(commonResponse("Cart updated successfully", true, updatedCart));
    } else {
      res
        .status(500)
        .json(
          commonResponse("Something went wrong while updating the cart", false)
        );
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.getCart = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Cart.findOne({ user: id })
      .populate("products.product")
      .exec();

    if (data) {
      let d = data;
      let processedProductIds = new Set();

      for (let i = 0; i < data.products?.length; i++) {
        const product = d.products[i]?.product;

        if (product && product.images) {
          // Check if the product has already been processed
          if (!processedProductIds.has(product._id.toString())) {
            const result = await processimagess(product.images);
            d.products[i].product.images = result;
            processedProductIds.add(product._id.toString());
          }
        }
      }
      res.status(200).json(commonResponse("Cart fetched", true, d));
    } else {
      res.status(404).json(commonResponse("Cart not found", false));
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};


exports.getCartCount = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Cart.findOne({ user: id }).exec();

    if (data) {
      const productCount = data.products ? data.products.length : -1;

      if (productCount >= 0) {
        res.status(200).json(
          commonResponse("Product count fetched", true, {
            count: productCount,
          })
        );
      } else {
        res
          .status(200)
          .json(commonResponse("Cart not found", false, { count: 0 }));
      }
    } else {
      res
        .status(200)
        .json(commonResponse("Cart not found", false, { count: 0 }));
    }
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json(commonResponse("Internal server error", false));
  }
};

exports.removeFromCart = async (req, res) => {
  const { product, user } = req.body;
  const cart = await Cart.findOne({ user: user }).exec();
  const products = returnjson(cart?.products);

  // Filter out the product to be removed
  const finalProduct = products?.filter((x) => x?.product !== product);

  // Initialize total_amount and totalpackweight
  let total_amount = 0;
  let totalPackWeight = 0;

  // Calculate total_amount and totalpackweight if finalProduct is not empty
  if (finalProduct && finalProduct.length > 0) {
    ({ total_amount, totalPackWeight } = finalProduct.reduce(
      (acc, curr) => {
        acc.total_amount += curr.price * curr.quantity;
        acc.totalPackWeight += curr.totalPackWeight;
        return acc;
      },
      { total_amount: 0, totalPackWeight: 0 }
    ));
  }

  // Update the cart with the modified products, total_amount, and totalpackweight
  const data = await Cart.findOneAndUpdate(
    { user: user },
    {
      products: finalProduct,
      total_amount,
      totalPackWeight,
      appliedCoupon: false,
      appliedCouponName: "",
      couponType: "",
      discount_amount: 0,
      $unset: {
        totalDiscountPercentage: "",
        maxCapDiscount: "",
        totalDiscountPrice: "",
        shippingDiscountPrice: "",
        shippingDiscountPercentage: "",
        couponUse: "",
      },
    }
  ).exec();

  if (data) {
    res.status(201).json(commonResponse("Product removed", true, data));
  } else {
    res.status(500).json(commonResponse("Something went wrong", false));
  }
};

exports.emptyCart = async (req, res) => {
  const { id } = req.body;
  const data = await Cart.findOneAndDelete({ user: id }).exec();
  if (data) {
    res.status(201).json(commonResponse("cart emptied", true, data));
  } else {
    res.status(500).json(commonResponse("something went wrong", false));
  }
};

exports.removeCoupon = async (req, res) => {
  const { user } = req.body;
  const cart = await Cart.findOne({ user: user }).exec();

  const data = await Cart.findOneAndUpdate(
    { user: user },
    {
      appliedCoupon: false,
      appliedCouponName: "",
      couponType: "",
      discount_amount: 0,
      $unset: {
        totalDiscountPercentage: "",
        maxCapDiscount: "",
        totalDiscountPrice: "",
        shippingDiscountPrice: "",
        shippingDiscountPercentage: "",
        couponUse: "",
      },
    }
  ).exec();

  if (data) {
    res.status(201).json(commonResponse("Coupon removed", true, data));
  } else {
    res.status(500).json(commonResponse("Something went wrong", false));
  }
};
