import mongoose from "mongoose";
import { phone } from "phone";
import axios from "axios";

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
  links: [
    {
      type: {
        type: String,
        enum: ["Website", "Instagram", "Facebook", "X", "Linkedin"],
      },

      url: {
        type: String,
      },
    },
  ],
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
  verified: {
    type: Boolean,
    default: false,
  },
  stripeAccount: {
    type: String,
    unique: true,
    sparse: true,
  },
});

designerSchema.methods.calcAverageRating = (ratings) =>
  (
    ratings.reduce((acc, rating) => (acc += rating.rating), 0) / ratings.length
  ).toFixed(1);

// Email validation function
async function validateEmail(email) {
  const res = await axios.get(
    `https://emailvalidation.abstractapi.com/v1/?api_key=b149a0dd58954e97acde8560298b7894&email=${email}`
  );
  return res.data.is_valid_format.value;
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
    if (!(await validateEmail(this.email))) {
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
