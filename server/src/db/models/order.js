import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  number: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: [
      "Completed",
      "Canceled",
      "In Progress",
      "Received",
      "Awaiting Payment",
    ],
    default: "Awaiting Payment",
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Designer",
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Option",
    },
  ],
  paymentData: {
    sessionID: {
      type: String,
      required: true,
      select: false,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  fees: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderExpires: {
    type: Date,
    expires: null,
  },
});

const rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};

orderSchema.pre("save", async function (next) {
  if (!this.isModified("paymentData.date") || this.isNew) {
    const dateObject = new Date(this.date * 1000);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    this.date = `${day}/${month}/${year}`;
  }
  if (!this.isModified("paymentData.amount") || this.isNew) {
    this.amount /= 100;
  }
  if (this.isNew) {
    this.number = rand();
    while (await this.constructor.findOne({ number: this.number })) {
      this.number = rand();
    }
  }
  try {
    await this.populate("options");
    this.fees = this.options.reduce((acc, option) => {
      const optionPrice = Number(option.price);
      const optionListPrice = option.optionList
        ? option.optionList.reduce(
            (acc, option) => acc + Number(option.price),
            0
          )
        : 0;

      return acc + optionPrice + optionListPrice;
    }, 0);

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", orderSchema);
