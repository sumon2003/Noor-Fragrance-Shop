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

    // DB user creation (isAdmin field remains false by default)
    const user = await User.create({
      name,
      email,
      password, 
      role: "user",
      isAdmin: false, // Default false for security
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

    // JWT token (isAdmin added to payload for backend security)
    const jwt = signToken({ id: user._id, role: user.role, isAdmin: user.isAdmin });

    return res.json({
      message: "Email verified successfully!",
      token: jwt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin, // <--- added to fix frontend redirect
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

    // email verification check
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    // password check
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // JWT token payload update
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