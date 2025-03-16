const { Fees } = require("../models");

const feesSeeds = {
  Model: Fees,
  data: [
    {
      studentId: "507f1f77bcf86cd799439011", // This should be a valid student ID
      amount: 5000,
      type: "tuition",
      status: "paid",
      dueDate: new Date("2024-01-15"),
      paidDate: new Date("2024-01-10")
    },
    {
      studentId: "507f1f77bcf86cd799439012", // This should be a valid student ID
      amount: 500,
      type: "library",
      status: "pending",
      dueDate: new Date("2024-02-01")
    },
    {
      studentId: "507f1f77bcf86cd799439013", // This should be a valid student ID
      amount: 1000,
      type: "laboratory",
      status: "overdue",
      dueDate: new Date("2023-12-31")
    }
  ]
};

module.exports = feesSeeds;