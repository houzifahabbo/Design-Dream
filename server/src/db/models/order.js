const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "Canceled", "In Progress", "Received"],
    default: "Received",
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Designer",
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  fees: {
    type: String,
  },
});

// function roundToNearest15Minutes(date) {
//   const roundedDate = new Date(date);
//   const minutes = roundedDate.getMinutes();
//   const remainder = minutes % 15;

//   if (remainder < 8) {
//     roundedDate.setMinutes(minutes - remainder);
//   } else {
//     roundedDate.setMinutes(minutes + (15 - remainder));
//   }

//   return roundedDate;
// }

// // Check if the event is expired
// orderSchema.pre("save", function (next) {
//   const currentTime = new Date();
//   this.start_date = roundToNearest15Minutes(this.start_date);
//   this.end_date = roundToNearest15Minutes(this.end_date);
//   if (
//     (this.isModified("end_date") || this.isNew) &&
//     this.end_date < currentTime
//   ) {
//     return next(new Error("End date cannot be in the past"));
//   }

//   if (
//     (this.isModified("start_date") || this.isNew) &&
//     this.start_date < currentTime
//   ) {
//     return next(new Error("Start date cannot be in the past"));
//   }
//   if (
//     (this.isModified("end_date") ||
//       this.isModified("start_date") ||
//       this.isNew) &&
//     this.end_date < this.start_date
//   ) {
//     return next(new Error("End date cannot be before start date"));
//   }

//   next();
// });

module.exports = mongoose.model("Order", orderSchema);
