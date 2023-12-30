import mongoose from "mongoose";
import { phone } from "phone";
import axios from "axios";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: [],
    },
  ],
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  userExpires: {
    type: Date,
    expires: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual("fullname").get(function () {
  if (!this.firstname) {
    return this.username;
  }
  if (!this.lastname) {
    return this.firstname;
  }
  return `${this.firstname} ${this.lastname}`;
});

// Email validation function
async function validateEmail(email) {
  const res = await axios.get(
    `https://emailvalidation.abstractapi.com/v1/?api_key=b149a0dd58954e97acde8560298b7894&email=${email}`
  );
  return res.data.is_valid_format.value;
}

function validatePhone(phoneNum) {
  const result = phone(phoneNum);
  if (result.isValid) {
    return true;
  }
  return false;
}

// Middleware to validate email and phone number before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("email") || this.isNew) {
    if (!(await validateEmail(this.email))) {
      return next(new Error("Invalid email format."));
    }
  }
  if (this.isModified("phoneNumber") || this.isNew) {
    if (!this.phoneNumber) {
      return next();
    } else if (!validatePhone(this.phoneNumber)) {
      return next(new Error("Invalid phoneNumber format."));
    }
  }
  next();
});

userSchema.virtual("account", {
  ref: "Account", // Reference to the Accounts collection
  localField: "_id",
  foreignField: "user",
  justOne: true, // As it's a one-to-one relationship
});

userSchema.set("toObject", {
  virtuals: true,
});
userSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("User", userSchema);
