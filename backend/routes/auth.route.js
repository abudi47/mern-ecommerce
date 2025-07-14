import express from "express";
import {
  signup,
  signout,
  login,
  checkAuth,
  refreshToken
} from "../controller/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);
router.post("/check-auth", checkAuth);
router.post("/refresh-token", refreshToken);

export default router;
