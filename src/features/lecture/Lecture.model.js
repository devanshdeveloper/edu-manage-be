const LectureSchema = new mongoose.Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: { type: String, required: true },
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    timeSlot: { type: String, required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom" },
  },
  { timestamps: true }
);

LectureSchema.index({ teacher: 1, day: 1, timeSlot: 1 }, { unique: true });
LectureSchema.index({ classroom: 1, day: 1, timeSlot: 1 }, { unique: true });

Lecture = mongoose.model("Lecture", LectureSchema);
module.exports = Lecture;
