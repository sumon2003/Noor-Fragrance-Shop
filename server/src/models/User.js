import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  
  role: { 
    type: String, 
    enum: ["user", "admin", "Customer", "Admin"], 
    default: "Customer" 
  },
  
  isAdmin: { 
    type: Boolean, 
    default: false, 
    required: true 
  },

  isBlocked: { 
    type: Boolean, 
    default: false 
  },

  isEmailVerified: { type: Boolean, default: false },
  emailVerifyTokenHash: String,
  emailVerifyTokenExpires: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;