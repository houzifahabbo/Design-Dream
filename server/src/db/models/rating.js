import mongoose from "mongoose";

const ratingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  reply: [
    {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "modelType",
        required: true,
        uniqe: true,
      },
      modelType: {
        type: String,
        enum: ["User", "Designer"],
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Rating", ratingSchema);
