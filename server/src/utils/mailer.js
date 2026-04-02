import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 

// From .env file 
const {
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  CLIENT_URL,
} = process.env;

// Gmail SMTP 
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  try {
    if (!CLIENT_URL) throw new Error("CLIENT_URL is missing in .env");

    const verifyUrl = `${CLIENT_URL}/verify-email/${token}`;
    const from = EMAIL_FROM || EMAIL_USER;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color: #333;">
        <h2 style="color: #fbbf24;">Verify your email</h2>
        <p>Welcome to <strong>Noor Fragrance</strong>! Please verify your email by clicking the button below:</p>
        <p>
          <a href="${verifyUrl}"
             style="display:inline-block;background:#fbbf24;color:#000;padding:12px 20px;
                    border-radius:8px;text-decoration:none;font-weight:bold">
            Verify Email Now
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${verifyUrl}</p>
        <p style="color:#666;font-size:12px">This link will expire in 24 hours.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Noor Fragrance" <${from}>`,
      to,
      subject: "Verify your email - Noor Fragrance",
      html,
    });

    console.log("📧 Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mailer Error:", error.message);
    throw error; 
  }
};