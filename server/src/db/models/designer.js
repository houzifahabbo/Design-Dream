import mongoose from "mongoose";
import { phone } from "phone";

const designerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  logo: {
    imageData: {
      type: Buffer,
    },
    contentType: {
      type: String,
    },
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
    },
  ],
  photos: [
    {
      imageData: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  links: {
    type: Object,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  designerExpires: {
    type: Date,
    expires: null,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
});

designerSchema.methods.calcAverageRating = (ratings) =>
  (
    ratings.reduce((acc, rating) => (acc += rating.rating), 0) / ratings.length
  ).toFixed(1);

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePhone(phoneNum) {
  const result = phone(phoneNum, { validateMobilePrefix: false });
  if (result.isValid) {
    return true;
  }
  return false;
}

// Middleware to validate email and phone number before saving
designerSchema.pre("save", async function (next) {
  if (this.isModified("email") || this.isNew) {
    if (!validateEmail(this.email)) {
      return next(new Error("Invalid email format."));
    }
  }
  if (this.isModified("phoneNumber") || this.isNew) {
    if (!validatePhone(this.phoneNumber)) {
      return next(new Error("Invalid phoneNumber format."));
    }
  }
  next();
});

export default mongoose.model("Designer", designerSchema);
