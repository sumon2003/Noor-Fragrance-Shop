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

    // পরিবর্তন: এখানে আমরা পাথ-এর পরিবর্তে কুয়েরি প্যারামিটার ব্যবহার করছি
    // আগে ছিল: /verify-email/${token}
    // এখন হবে: /verify-email?token=${token}
    const verifyUrl = `${CLIENT_URL}/verify-email?token=${token}`;
    
    const from = EMAIL_FROM || EMAIL_USER;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color: #fff; background-color: #000; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
           <h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 10px;">NOOR FRAGRANCE</h1>
           <p style="color: #d1d5db; font-size: 14px; letter-spacing: 2px;">PREMIUM ATTAR COLLECTION</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(251,191,36,0.1);">
          <h2 style="color: #fbbf24; margin-top: 0;">Welcome to the family!</h2>
          <p style="color: #e5e7eb;">Thank you for joining <strong>Noor Fragrance</strong>. To start your luxury scent journey, please verify your email address.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verifyUrl}"
               style="display:inline-block; background:#fbbf24; color:#000; padding:16px 32px;
                      border-radius:12px; text-decoration:none; font-weight:bold; font-size: 16px;
                      box-shadow: 0 4px 15px rgba(251,191,36,0.3);">
              Verify Email Now
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 13px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-size: 12px; color: #fbbf24; word-break: break-all; border: 1px solid rgba(251,191,36,0.05);">
            ${verifyUrl}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
          <p>This verification link will expire in 24 hours.</p>
          <p>&copy; 2026 Noor Fragrance. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Noor Fragrance" <${from}>`,
      to,
      subject: "Verify your email - Noor Fragrance",
      html,
    });

    console.log("📧 Verification Email sent with Query Token: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mailer Error:", error.message);
    throw error; 
  }
};