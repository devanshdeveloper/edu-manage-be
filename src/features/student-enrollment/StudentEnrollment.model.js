const mongoose = require("mongoose");

const StudentEnrollmentSchema = new mongoose.Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom" },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: String,
  },
  { timestamps: true }
);

StudentEnrollmentSchema.index({ student: 1, classroom: 1 }, { unique: true });
const StudentEnrollment = mongoose.model(
  "StudentEnrollment",
  StudentEnrollmentSchema
);
module.exports = StudentEnrollment;
