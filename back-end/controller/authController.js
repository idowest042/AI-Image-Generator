import bcrypt from "bcryptjs";
import user from "../model/userModel.js"
import { sendVerificationEmail } from "../config/nodeMailer.js";
import crypto from "crypto";
import { generateToken } from "../config/utilis.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send the code via email
    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message: "Signup successful! Check your email for the verification code.",
      userId: newUser._id
    });

  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/authController.js
export const verifyUser = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (foundUser.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    console.log("User code in DB:", foundUser.verificationCode);
console.log("Code from request:", code);
console.log("Expiry in DB:", foundUser.verificationCodeExpires);
console.log("Current time:", Date.now());

    if (
      foundUser.verificationCode !== code ||
      foundUser.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Mark as verified
    foundUser.isVerified = true;
    foundUser.verificationCode = undefined;
    foundUser.verificationCodeExpires = undefined;
    await foundUser.save();

    // ✅ Now generate token here
    const token = generateToken(foundUser._id, res);

    return res.status(200).json({
      message: "Account verified successfully!",
      token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email
      }
    });

  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find user
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Check password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Check if email is verified
    if (!existingUser.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // 5️⃣ Generate token
    const token = generateToken(existingUser._id, res);

    // 6️⃣ Success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token,
    });

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error);
    res.status(500).json({ msg: "internal error" });
  }
};