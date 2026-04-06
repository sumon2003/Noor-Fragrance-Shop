import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { createEmailVerifyToken, hashToken } from "../utils/tokens.js";
import { sendVerificationEmail } from "../utils/mailer.js";

// 1. REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    // ভেরিফিকেশন টোকেন জেনারেশন
    const { token, tokenHash, expires } = createEmailVerifyToken();

    const user = await User.create({
      name,
      email,
      password, 
      role: "user",
      isAdmin: false, 
      isEmailVerified: false,
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: expires,
    });

    try {
      await sendVerificationEmail(user.email, token);
      console.log(`📧 Verification email sent to: ${user.email}`);
    } catch (mailError) {
      console.error("❌ Mailer Error:", mailError.message);
      return res.status(201).json({
        message: "Account created, but verification email failed. Please contact support.",
        user_id: user._id
      });
    }

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify.",
    });
  } catch (error) {
    console.error("❌ Register Controller Error:", error.message);
    return res.status(500).json({ message: "Register error", error: error.message });
  }
};

// 2. VERIFY EMAIL (The Smart Way)
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const tokenHash = hashToken(token);
    
    // ১. প্রথমে দেখি এই টোকেন দিয়ে কোনো ইউজার আছে কি না যার মেয়াদ এখনও আছে
    let user = await User.findOne({
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: { $gt: new Date() }, 
    });

    if (!user) {
      console.log("ℹ️ User might be already verified or token expired. Sending success to keep UX smooth.");
      
      return res.json({
        message: "Your email is already verified! Welcome back.",
        alreadyVerified: true
      });
    }

    // ৩. ভেরিফিকেশন সফল হলে ডাটা আপডেট করা
    user.isEmailVerified = true;
    user.emailVerifyTokenHash = undefined; 
    user.emailVerifyTokenExpires = undefined;
    await user.save();

    console.log("✅ Email verified for:", user.email);

    const jwt = signToken({ id: user._id, role: user.role, isAdmin: user.isAdmin });

    return res.json({
      message: "Email verified successfully! Congratulations.",
      token: jwt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("🔥 Verify Error:", error.message);
    return res.status(500).json({ message: "Verification system encountered an error." });
  }
};

// 3. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email address first." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id, role: user.role, isAdmin: user.isAdmin });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin, 
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login error", error: error.message });
  }
};

// 4. ME (GET PROFILE)
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Me error", error: error.message });
  }
};