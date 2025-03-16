const { Material } = require("../models");

const materialSeeds = {
  Model: Material,
  data: [
    {
      title: "Introduction to Physics",
      description: "Basic concepts of classical mechanics",
      type: "document",
      fileUrl: "https://example.com/materials/physics-intro.pdf",
      subject: "Physics"
    },
    {
      title: "Advanced Mathematics Tutorial",
      description: "Video lecture on calculus",
      type: "video",
      fileUrl: "https://example.com/materials/math-tutorial.mp4",
      subject: "Mathematics"
    },
    {
      title: "Biology Presentation",
      description: "Cell structure and function",
      type: "presentation",
      fileUrl: "https://example.com/materials/biology-cells.pptx",
      subject: "Biology"
    }
  ]
};

module.exports = materialSeeds;