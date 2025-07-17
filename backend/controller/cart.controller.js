// import { cache } from "react";

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

export const getCartItems = async (req, res) => {};

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
