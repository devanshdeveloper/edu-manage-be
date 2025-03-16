const { Schema, model } = require("mongoose");
const Statuses = require("../../constants/Statuses");

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Statuses),
      default: Statuses.Active,
    },
    syllabus: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = model("Subject", subjectSchema);

module.exports = Subject;
