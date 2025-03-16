const { Department } = require("../models");

const departmentSeeds = {
  Model: Department,
  data: [
    {
      _id: "67cc119e3782221dbd8c2009",
      name: "Computer Science",
      description: "Department focused on computer science and programming",
    },
    {
      _id: "67cc119e3782221dbd8c2009",
      name: "Mathematics",
      description: "Department dedicated to mathematical sciences and research",
    },
    {
      _id: "67cc119e3782221dbd8c2016",
      name: "Physics",
      description:
        "Department specializing in physical sciences and experiments",
    },
    {
      _id: "67cc119e3782221dbd8c2018",
      name: "English Literature",
      description:
        "Department focusing on English language and literature studies",
    },
    {
      _id: "67cc119e3782221dbd8c201a",
      name: "History",
      description: "Department dedicated to historical studies and research",
    },
  ],
};

module.exports = departmentSeeds;
