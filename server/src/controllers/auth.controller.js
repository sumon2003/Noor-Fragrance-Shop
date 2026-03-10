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

    // Email verification token
    const { token, tokenHash, expires } = createEmailVerifyToken();

    // DB user 
    const user = await User.create({
      name,
      email,
      password, 
      role: "user",
      isEmailVerified: false,
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: expires,
    });

    // Email send verification
    try {
      await sendVerificationEmail(user.email, token);
      console.log(`📧 Verification email sent to: ${user.email}`);
    } catch (mailError) {
      console.error("❌ Mailer Error (Register):", mailError.message);
      return res.status(201).json({
        message: "Registration successful, but we couldn't send the verification email. Please contact support.",
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

// 2. VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("🔍 Received Token for verification:", token); 

    if (!token) return res.status(400).json({ message: "Token is required" });

   
    const tokenHash = hashToken(token);
    console.log("🧪 Generated Hash:", tokenHash);

    
    const user = await User.findOne({
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: { $gt: new Date() }, 
    });

    if (!user) {
      console.log("❌ No user found with this hash or token expired.");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Successfully verified
    user.isEmailVerified = true;
    user.emailVerifyTokenHash = undefined; 
    user.emailVerifyTokenExpires = undefined;
    await user.save();

    console.log("✅ Email verified for:", user.email);

    // JWT token 
    const jwt = signToken({ id: user._id, role: user.role });

    return res.json({
      message: "Email verified successfully!",
      token: jwt,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🔥 Verify Error:", error.message);
    return res.status(500).json({ message: "Verify error", error: error.message });
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

    // ইমেইল ভেরিফাইড না হলে লগইন করতে দেওয়া হবে না
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    // পাসওয়ার্ড চেক
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login error", error: error.message });
  }
};

// ME
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Me error", error: error.message });
  }
};