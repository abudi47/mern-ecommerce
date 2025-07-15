import Product from "../models/product.model.js";

export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getAllProducts:", error.message);
        res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
        
    }

}

export const getFeaturedProducts = async (req, res) => {
    const featureProducts = await Product.find({ isFeatured: true });
    try {
        res.status(200).json(featureProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts:", error.message);
        res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });    
    }
}