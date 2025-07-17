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
    const image = req.file;// Assuming the image is sent as a file in the request

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

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products-ecommerce/${publicId}`);
        console.log("Deleted image from Cloudinary");
      } catch (error) {
        console.log("error deleting image from Cloudinary:", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("error in deleteProduct:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } }, // Randomly select 3 products
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          image: 1,
          category: 1,
        }, // Include only necessary fields
      },
    ]);
  } catch (error) {
    console.log("Error in getRecommendedProducts:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    try {
      const products = await Product.find({ category });
      res.status(200).json(products);
    } catch (error) {
      res.status(404).json({ message: "No products found in this category" });
    }
  } catch (error) {
    console.log("Error in getProductsByCategory:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const togglefeaturedProduct = async (req, res) => {
  try {
    const product = req.params.id;
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.status(200).json({
        message: `Product ${
          updatedProduct.isFeatured ? "featured" : "unfeatured"
        } successfully`,
        product: updatedProduct,
      });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in togglefeaturedProduct:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featureProducts = await product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featureProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductsCache:", error.message);
  }
}
