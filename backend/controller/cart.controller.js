// import { cache } from "react";
import Product from "../models/product.model.js";
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = req.user;

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.log("Error in addToCart:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } }); //

    //add quantity to each product
    const cartProducts = products.map((product) => {
      const cartItem = req.user.cartItems.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      return {
        ...product.toJSON(),
        quantity: cartItem ? cartItem.quantity : 1, // Default quantity to 1 if not found
      };
    });
    res.status(200).json(cartProducts);
  } catch (error) {
    console.log("Error in getCartProducts:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
  } catch (error) {
    console.log("Error in removeAllFromCart:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // Assuming productId is passed in the URL
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};
