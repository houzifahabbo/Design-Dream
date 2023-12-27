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
      user: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      review: {
        type: String,
      },
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
});

designerSchema.virtual("avgRating").get(function () {
  let sum = 0;
  this.ratings.forEach((rating) => {
    sum += rating.rating;
  });
  return sum / this.ratings.length;
});

module.exports = mongoose.model("Designer", designerSchema);
