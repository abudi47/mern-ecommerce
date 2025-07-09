
import express from "express";
import { signup, signout, login } from "../controller/auth.controller.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);


export default router;