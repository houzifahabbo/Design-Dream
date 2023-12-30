import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  number: {
    type: String,
    unique: true,
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
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Option",
    },
  ],
  paymentData: {
    type: String,
    required: true,
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
