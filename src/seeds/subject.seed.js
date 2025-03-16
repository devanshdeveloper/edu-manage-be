const { Subject } = require("../models");
const Statuses = require("../constants/Statuses");

const subjectSeeds = {
  Model: Subject,
  data: [
    {
      _id: "67cc136dafa3e307cd531ad6",
      name: "Introduction to Programming",
      description: "Basic concepts of programming using Python and Java",
      department: "67cc119e3782221dbd8c2009",
      status: Statuses.Active,
      syllabus: "Programming fundamentals, data structures, algorithms",
    },
    {
      _id: "67cc136dafa3e307cd531ae2",
      name: "Web Development",
      description: "Modern web development technologies and practices",
      department: "67cc119e3782221dbd8c2009",
      status: Statuses.Active,
      syllabus: "HTML, CSS, JavaScript, React, Node.js",
    },
    {
      _id: "67cc136dafa3e307cd531ae4",
      name: "Calculus I",
      description: "Fundamental concepts of differential and integral calculus",
      department: "67cc119e3782221dbd8c2009",
      status: Statuses.Active,
      syllabus: "Limits, derivatives, integrals, applications",
    },
    {
      _id: "67cc136dafa3e307cd531ae6",
      name: "Linear Algebra",
      description: "Study of linear equations and linear functions",
      department: "67cc119e3782221dbd8c2009",
      status: Statuses.Active,
      syllabus: "Matrices, vector spaces, linear transformations",
    },
    {
      _id: "67cc136dafa3e307cd531ae8",
      name: "Quantum Mechanics",
      description: "Introduction to quantum physics principles",
      department: "67cc119e3782221dbd8c2016",
      status: Statuses.Active,
      syllabus: "Wave functions, Schrödinger equation, quantum states",
    },
    {
      _id: "67cc136dafa3e307cd531aea",
      name: "Classical Mechanics",
      description: "Study of motion and physical forces",
      department: "67cc119e3782221dbd8c2016",
      status: Statuses.Active,
      syllabus: "Newton's laws, conservation laws, dynamics",
    },
    {
      _id: "67cc136dafa3e307cd531aec",
      name: "Shakespeare Studies",
      description: "Comprehensive study of Shakespeare's works",
      department: "67cc119e3782221dbd8c2018",
      status: Statuses.Active,
      syllabus: "Major plays, sonnets, historical context",
    },
    {
      _id: "67cc136dafa3e307cd531aee",
      name: "Modern Literature",
      description: "Analysis of contemporary literary works",
      department: "67cc119e3782221dbd8c2018",
      status: Statuses.Active,
      syllabus: "20th and 21st century literature, critical analysis",
    },
    {
      _id: "67cc136dafa3e307cd531af0",
      name: "World History",
      description: "Overview of major historical events and periods",
      department: "67cc119e3782221dbd8c201a",
      status: Statuses.Active,
      syllabus: "Ancient civilizations to modern era",
    },
    {
      _id: "67cc136dafa3e307cd531af2",
      name: "Historical Research Methods",
      description: "Techniques and methodologies in historical research",
      department: "67cc119e3782221dbd8c201a",
      status: Statuses.Active,
      syllabus: "Primary sources, historiography, research techniques",
    },
  ],
};

module.exports = subjectSeeds;
