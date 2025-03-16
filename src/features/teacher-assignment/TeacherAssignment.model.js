const TeacherAssignmentSchema = new mongoose.Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    role: {
      type: String,
      required: true,
      enum: ["lead", "assistant", "substitute"],
    },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom" },
  },
  { timestamps: true }
);

TeacherAssignmentSchema.index({ classroom: 1 }, { unique: true });
const TeacherAssignment = mongoose.model(
  "TeacherAssignment",
  TeacherAssignmentSchema
);
module.exports = TeacherAssignment;
