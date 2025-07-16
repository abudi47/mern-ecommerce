import Product from "../models/product.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAllProducts:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featureProducts = await redis.get("featuredProducts");
    if (featureProducts) {
      featureProducts = JSON.parse(featureProducts);
      return res.status(200).json(featureProducts);
    }

    //if not in redis fetch from the mongo db and store in redis
    // lean is used to return plain JavaScript objects instead of Mongoose documents for better performance
    featureProducts = await Product.find({ isFeatured: true }).lean();

    if (!featureProducts || featureProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set(
      "featuredProducts",
      JSON.stringify(featureProducts),
      "EX",
      60 * 60
    ); // Cache for 1 hour
    res.status(200).json(featureProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file;

    let cloudinaryResponse;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products-ecommerce",
      });
    }

    const product = new Product({
      name,
      price,
      description,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
      category,
    });
    await product.save();
    res.status(201).json({ product, message: "Product created successfully" });
  } catch (error) {
    console.log("Error in createProduct:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};
