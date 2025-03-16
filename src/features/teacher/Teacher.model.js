const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: [true, "At least one subject is required"],
      },
    ],
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience years cannot be negative"],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for teacher's full name

// Index for faster queries
teacherSchema.index({ user: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
