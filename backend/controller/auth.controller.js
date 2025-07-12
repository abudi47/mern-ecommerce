import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import client from "../lib/redis.js";

const generateTokens = (userId) => {
  // Function to generate access and refresh tokens
  // This is a placeholder; implement your token generation logic here
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await client.set(`refreshToken:${userId}`, refreshToken,"EX",7 * 24 * 60 * 60); // Store refresh token in Redis with 7 days expiration

}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",// Use true if your site is served over HTTPS
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",// Use true if your site is served over HTTPS
    maxAge: 7 * 24 * 60 * 60, 
  })


}
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json({ message: "User already exists" });   
    }
    const user = new User({ name, email, password });

    if (user) {
        await user.save();

        const {accessToken, refreshToken} = generateTokens(user._id);

        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        

        res.status(200).json({
          user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,

        createdAt: user.createdAt,
        },
        message: "User created successfully",
    });
    }
    else {
      res.status(400).json({ message: "invalid userData" });
    }
   
    

    
  } catch (error) {
     res.status(500).json({ message: error.message ||"INTERNAL SERVER ERROR" });
     console.log(error.message)
  }
};

export const login = async (req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user){
        return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user
    res.send("logging")
}
export const signout = async (req,res) => {
    res.send("logoutt")
}