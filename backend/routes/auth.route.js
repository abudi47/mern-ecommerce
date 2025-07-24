import express from "express";
import {
  signup,
  signout,
  login,
  checkAuth,
  refreshToken,
  getAllUsers,
  getProfile,
} from "../controller/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);
router.post("/check-auth", checkAuth);
router.post("/refresh-token", refreshToken);
router.get("/profile", getProfile);

//only for testing purposes
router.get("/users" , getAllUsers);

export default router;
