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

// function validatePasswordStrength(password) {
//   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//   return passwordRegex.test(password);
// }

// designerSchema.pre("save", async function (next) {
//   if (this.isModified("password") || this.isNew) {
//     // Validate the password
//     if (!validatePasswordStrength(this.password)) {
//       return next(
//         new Error(
//           "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
//         )
//       );
//     }
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(this.password, saltRounds);
//     this.password = hashedPassword;
//   }
//   next();
// });

// designerSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model("Designer", designerSchema);

 // password: {
  //   type: String,
  //   required: true,
  // },
  // events: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Event",
  //   },
  // ],