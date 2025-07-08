
import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

const app = express();
dotenv.config();
connectDB();
const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`)
})