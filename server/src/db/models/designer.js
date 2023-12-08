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
  },
  { discriminatorKey: "type", _id: false }
);

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
  options: [optionSchema],
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
  googleId: {
    type: String,
  },
  links: {
    type: Object,
  },
});

designerSchema.path("options").discriminator(
  "text field" || "text area",
  new mongoose.Schema({
    placeholder: {
      type: String,
    },
    dataType: {
      type: String,
      enum: ["text", "number", "email", "tel", "url"],
    },
    data: {
      type: String,
    },
  })
);

designerSchema.path("options").discriminator(
  "checkbox" || "radio button" || "dropdown",
  new mongoose.Schema({
    optionList: [
      {
        type: String,
        required: true,
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

designerSchema.path("options").discriminator(
  "file",
  new mongoose.Schema({
    fileType: {
      type: String,
      enum: ["image", "video", "audio", "pdf", "doc", "docx", "ppt", "pptx"],
    },
  })
);

designerSchema.path("options").discriminator(
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

designerSchema.path("options").discriminator(
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

designerSchema.path("options").discriminator(
  "location",
  new mongoose.Schema({
    location: {
      type: String,
    },
  })
);

module.exports = mongoose.model("Designer", designerSchema);


// events: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Event",
//   },
// ],
