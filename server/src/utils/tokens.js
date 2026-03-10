import crypto from "crypto";

export const createEmailVerifyToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, tokenHash, expires };
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
