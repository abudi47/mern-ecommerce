import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
} from "../controller/product.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";
import multer from "multer";
const router = express.Router();
const upload = multer();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post(
  "/create",
  protectedRoute,
  adminRoute,
  upload.single("image"),
  createProduct
);
export default router;
