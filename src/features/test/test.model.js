const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    }
  }],
}, {timestamps: true});

module.exports = mongoose.model('Test', testSchema);