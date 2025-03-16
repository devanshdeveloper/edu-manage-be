const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
      match: [/^[A-Z]{3}\d{4}$/, "Student ID must be in the format ABC1234"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[1-9][0-9]{7,14}$/, "Please enter a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: true,
      min: [10, "Address must be at least 10 characters long"],
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
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

// Virtual for student's full name
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
studentSchema.index({ user: 1 });

// Pre-save middleware to ensure email is lowercase
studentSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
