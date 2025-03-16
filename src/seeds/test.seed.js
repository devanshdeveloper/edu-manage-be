const { Test } = require("../models");

const testSeeds = {
  Model: Test,
  data: [
    {
      title: "Mathematics Mid-Term",
      description: "Mid-term examination for Mathematics covering algebra and calculus",
      subject: "Mathematics",
      duration: 120,
      totalMarks: 100,
      questions: [
        {
          question: "What is the derivative of x²?",
          options: ["2x", "x", "x²", "1"],
          correctAnswer: "2x",
          marks: 10
        },
        {
          question: "Solve for x: 2x + 5 = 13",
          options: ["4", "8", "3", "6"],
          correctAnswer: "4",
          marks: 10
        }
      ]
    },
    {
      title: "English Literature Final",
      description: "Final examination covering Shakespeare and modern literature",
      subject: "English",
      duration: 180,
      totalMarks: 100,
      questions: [
        {
          question: "Who wrote 'Romeo and Juliet'?",
          options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
          correctAnswer: "William Shakespeare",
          marks: 10
        },
        {
          question: "What is the main theme of 'To Kill a Mockingbird'?",
          options: ["Justice", "Love", "War", "Nature"],
          correctAnswer: "Justice",
          marks: 10
        }
      ]
    }
  ]
};

module.exports = testSeeds;