import User from "../models/user.model.js";
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

        res.status(200).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
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
    res.send("logging")
}
export const signout = async (req,res) => {
    res.send("logoutt")
}