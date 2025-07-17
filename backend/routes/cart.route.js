import express from "express";
import {
  addToCart,
  getCartItems,
  removeAllFromCart,
  updateQuantity,
} from "../controller/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, addToCart);
router.get("/", protectedRoute, getCartItems);
router.delete("/", protectedRoute, removeAllFromCart);

router.put("/:id", protectedRoute, updateQuantity);

export default router;
