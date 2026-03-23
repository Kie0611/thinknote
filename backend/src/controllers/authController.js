import User from "../models/User.js";
import { generateToken } from "../middleware/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    username = username.trim();

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 3 and 20 characters",
      });
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.]{2,19}$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username must start with a letter and contain only letters, numbers, underscores, or dots",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    email = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ← added
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email})
    
    if(!user) return res.status(400).json({message: "Invalid credentials"}) 
      //never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password) 

    if (!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"})

    generateToken(user._id, res)
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.error("Error in login controller:", error)
    res.status(500).json({message: "Internal server error:", error})
  }
}

export const logout = (_, res) => {
  res.cookie("jwt", "", {maxAge: 0})
  res.status(200).json({message: "Logged out successfully"})
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password") //exclude password

    if (!user) return res.status(404).json({message: "User not found"})
    res.status(200).json(user)
  } catch (error) {
    console.error("Error in getProfile controller:", error)
    res.status(500).json({message: "Internal server error"})
  }
}