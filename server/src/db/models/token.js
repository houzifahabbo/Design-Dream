const mongoose = require("mongoose");

const rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};

const token = function () {
  return rand() + rand() + rand() + "-" + rand() + rand() + rand(); // to make it longer
};

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    default: token,
  },
  model_type: {
    type: String,
    enum: ["User", "Designer"],
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "model_type",
    required: true,
  },
  expires: {
    type: Date,
    default: Date.now,
    expiers: 10 * 60 * 1000,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
