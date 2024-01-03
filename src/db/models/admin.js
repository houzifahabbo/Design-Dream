import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Middleware to validate email and phone number before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("email") || this.isNew) {
    if (!validateEmail(this.email)) {
      return next(new Error("Invalid email format."));
    }
  }
  next();
});

export default mongoose.model("Admin", adminSchema);
