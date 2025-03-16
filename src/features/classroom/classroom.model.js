const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    resources: [
      {
        type: String,
        enum: [
          "Projector",
          "Computer",
          "Lab Equipment",
          "Sound System",
          "Printer",
        ],
      },
    ],
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classroom", ClassroomSchema);
