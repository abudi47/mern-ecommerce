import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.userId;
      const user = User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "Invalid access token" });
      }
      req.user = user; // Attach user to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Access token has expired" }); 
        }
        throw error; // Re-throw other errors for global error handling 
    }
  } catch (error) {
    console.log("Error in protectedRoute:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};
