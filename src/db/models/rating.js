import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const ratingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  reply: {
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designer",
    },
    text: {
      type: String,
    },
  },
});

ratingSchema.plugin(mongooseAutoPopulate);

export default mongoose.model("Rating", ratingSchema);
