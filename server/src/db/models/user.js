const mongoose = require("mongoose");

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
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
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
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Middleware to validate email and age before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("email") || this.isNew) {
    if (!validateEmail(this.email)) {
      return next(new Error("Invalid email format."));
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

module.exports = mongoose.model("User", userSchema);
