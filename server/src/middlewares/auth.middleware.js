import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    
    const decoded = verifyToken(token);

    
    const user = await User.findById(decoded.id).select("-password -passwordHash");
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    if (user.isActive === false) {
      return res.status(401).json({ message: "Unauthorized: user account is inactive" });
    }

    req.user = user; 
    next(); 
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};

export const requireAuth = protect;