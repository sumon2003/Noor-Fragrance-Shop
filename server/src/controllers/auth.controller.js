import crypto from "crypto";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { createEmailVerifyToken } from "../utils/tokens.js";
import { sendVerificationEmail } from "../utils/mailer.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
    });

    // create verify token + store hash
    const { token, tokenHash, expiresAt } = createEmailVerifyToken();
    user.emailVerifyTokenHash = tokenHash;
    user.emailVerifyTokenExpires = expiresAt;
    await user.save();

    // send mail (fail হলেও register হবে)
    try {
      await sendVerificationEmail({ to: user.email, name: user.name, token });
    } catch (e) {
      console.error("MAIL ERROR:", e?.message || e);
    }

    const jwt = signToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: "Registered. Please check your email to verify.",
      token: jwt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const jwt = signToken({ id: user._id, role: user.role });

    return res.json({
      token: jwt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  // protect middleware already adds req.user
  res.json({ user: req.user });
};

// verify endpoint
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ message: "Token missing" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.emailVerifyTokenHash = null;
    user.emailVerifyTokenExpires = null;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

// resend verification (optional but pro)
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const { token, tokenHash, expiresAt } = createEmailVerifyToken();
    user.emailVerifyTokenHash = tokenHash;
    user.emailVerifyTokenExpires = expiresAt;
    await user.save();

    await sendVerificationEmail({ to: user.email, name: user.name, token });

    return res.json({ message: "Verification email resent" });
  } catch (err) {
    next(err);
  }
};
