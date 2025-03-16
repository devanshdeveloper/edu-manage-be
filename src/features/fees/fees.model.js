const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["tuition", "library", "laboratory", "other"],
    },
    status: {
      type: String,
      required: true,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fees", feesSchema);
