const mongoose = require("mongoose");

//Todo: Add validation for email and phone number
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


module.exports = mongoose.model("Designer", designerSchema);
