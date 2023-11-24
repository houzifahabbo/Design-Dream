const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  sessionID: { type: String, required: true, select: false, unique: true },
  amount: { type: Number, required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
});

// paymentSchema.pre('save', function (next) {
//   this.date = new Date();
//   next();
// });

// paymentSchema.pre('save', function (next) {
//   if(!this.isModified('date') || this.isNew){
//     this.date = moment(new Date(this.date * 1000)).format('DD/MM/YYYY');
//   }
//   next();
// });

paymentSchema.pre("save", function (next) {
  if (!this.isModified("date") || this.isNew) {
    const dateObject = new Date(this.date * 1000);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    this.date = `${day}/${month}/${year}`;
  }
  if (!this.isModified("amount") || this.isNew) {
    this.amount /= 100;
  }
  next();
});

module.exports = mongoose.model("payment", paymentSchema);
