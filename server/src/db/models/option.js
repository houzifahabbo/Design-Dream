const mongoose = require("mongoose");

const optionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "date",
        "time",
        "location",
        "date and time",
        "text field",
        "checkbox",
        "radio button",
        "dropdown",
        "file",
        "text area",
      ],
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    price: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Designer",
    },
  },

  { discriminatorKey: "type" }
);

optionSchema.discriminator(
  "text field" || "text area",
  new mongoose.Schema({
    dataType: {
      type: String,
      enum: ["text", "number", "email", "tel", "url"],
    },
    data: {
      type: String,
    },
  })
);

optionSchema.discriminator(
  "checkbox" || "radio button" || "dropdown",
  new mongoose.Schema({
    optionList: [
      {
        text: {
          type: String,
          required: true,
        },
        price: {
          type: String,
        },
      },
    ],
    other: {
      type: Boolean,
    },
    otherText: {
      type: String,
    },
  })
);

optionSchema.discriminator(
  "file",
  new mongoose.Schema({
    fileType: {
      type: String,
      enum: ["image", "video", "audio", "pdf", "doc", "docx", "ppt", "pptx"],
    },
  })
);

optionSchema.discriminator(
  "date" || "time",
  new mongoose.Schema({
    min: {
      type: Date,
    },
    max: {
      type: Date,
    },
  })
);

optionSchema.discriminator(
  "date and time",
  new mongoose.Schema({
    min: {
      type: Date,
    },
    max: {
      type: Date,
    },
    minTime: {
      type: Date,
    },
    maxTime: {
      type: Date,
    },
  })
);

optionSchema.discriminator(
  "location",
  new mongoose.Schema({
    location: {
      type: String,
    },
  })
);

module.exports = mongoose.model("Option", optionSchema);
