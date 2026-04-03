import crypto from "crypto";

// tokens.js
export const createEmailVerifyToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  
  // ১ ঘণ্টার বদলে ২৪ ঘণ্টা মেয়াদ দিন (টেস্টিং এর সময় সুবিধা হবে)
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  
  return { token, tokenHash, expires };
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
