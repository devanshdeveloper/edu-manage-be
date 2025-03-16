const express = require("express");
const Models = require("../../models");
const {
  ResponseHelper,
  RequestHelper,
  validator,
  AuthHelper,
  MongoDBHelper,
  idValidatorMiddleware,
} = require("../../helpers");
const { ErrorMap, Operations, Modules, UserTypes } = require("../../constants");
const { permissionMiddleware } = require("../permission/permission.middleware");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();
const Teacher = Models.Teacher;
const User = Models.User;
const authHelper = new AuthHelper();

// Create a new teacher
router.post(
  "/create-one",
  validatorMiddleware({
    body: {
      name: [
        validator.required(),
        validator.string(),
        validator.minLength(2),
        validator.maxLength(50),
      ],
      email: [validator.required(), validator.email()],
      password: [validator.required()],
      employeeId: [validator.required(), validator.string()],
      subjects: [validator.required(), validator.array()],
      qualification: [validator.required(), validator.string()],
      experience: [validator.required(), validator.number(), validator.min(0)],
      phone: [validator.required(), validator.string()],
      address: [
        validator.required(),
        validator.string(),
        validator.minLength(10),
      ],
    },
  }),
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.CREATE,
    Modules: Modules.Teachers,
    Counter: (req) => {
      return Teacher.countDocuments({ user: req.user._id });
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return responseHelper
          .status(409)
          .error(ErrorMap.EMAIL_ALREADY_EXISTS)
          .send();
      }

      const teacherData = requestHelper.body();

      const hashedPassword = await authHelper.hashPassword(
        teacherData.password
      );
      const userId = new mongoose.Types.ObjectId();

      // Prepare documents for parallel creation
      const documents = [
        {
          model: User,
          data: {
            ...teacherData,
            _id: userId,
            password: hashedPassword,
            type: UserTypes.Teacher,
            user: req.user._id,
          },
        },
        {
          model: Teacher,
          data: {
            ...teacherData,
            user: userId,
          },
        },
      ];

      // Create both documents in parallel within a transaction
      const [createdUser, createdTeacher] =
        await MongoDBHelper.createParallelDocuments(documents);

      return responseHelper
        .status(201)
        .body({
          teacher: {
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            subject: createdTeacher.subject,
            phone: createdUser.phone,
          },
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Get all teachers
router.get(
  "/paginate",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Teachers,
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    const { limit, page } = requestHelper.getPaginationParams();
    const { sortField, sortOrder } = requestHelper.getSortParams();
    /*
    // filter to add
    "name" , "email" , "subjects" , "department" , "qualification", "experience", "phone", "address"
    */
    const searchFilter = requestHelper.getSearchParams(
      "name",
      "email",
      "phone",
      "address"
    );
    const filter = {};

    console.log(searchFilter);

    try {
      const teacherUsers = await User.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "teachers",
            localField: "_id",
            foreignField: "user",
            as: "teacherInfo",
          },
        },
        {
          $unwind: "$teacherInfo",
        },
        {
          $lookup: {
            from: "subjects",
            localField: "teacherInfo.subjects",
            foreignField: "_id",
            as: "teacherInfo.subjects",
          },
        },
        {
          $facet: {
            docs: [
              {
                $skip: (page - 1) * limit,
              },
              { $limit: limit },
            ],
            totalDocs: [{ $count: "count" }],
          },
        },
        {
          $project: {
            docs: 1,
            totalDocs: { $arrayElemAt: ["$totalDocs.count", 0] },
            limit: { $literal: limit },
            page: { $literal: page },
            totalPages: {
              $ceil: {
                $divide: [{ $arrayElemAt: ["$totalDocs.count", 0] }, limit],
              },
            },
          },
        },
      ]);

      return responseHelper
        .status(200)
        .body({
          teachers: teacherUsers[0].docs,
          pagination: {
            totalDocs: teacherUsers[0].totalDocs,
            limit: teacherUsers[0].limit,
            page: teacherUsers[0].page,
            totalPages: teacherUsers[0].totalPages,
          },
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// stats
router.get(
  "/stats",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Teachers,
  }),
  async (req, res) => {
    const responseHelper = new ResponseHelper(res);
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);

      // Get current month stats
      const currentStats = await Teacher.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        },
        {
          $group: {
            _id: null,
            totalTeachers: { $sum: 1 },
            activeTeachers: {
              $sum: { $cond: [{ $eq: ["$userInfo.status", "active"] }, 1, 0] }
            },
            avgExperience: { $avg: "$experience" },
            uniqueSubjects: { $addToSet: "$subjects" }
          }
        },
        {
          $project: {
            _id: 0,
            totalTeachers: 1,
            activeTeachers: 1,
            avgExperience: { $round: ["$avgExperience", 1] },
            subjectsCovered: { $size: { $reduce: {
              input: "$uniqueSubjects",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this"] }
            }}}
          }
        }
      ]);

      // Get last month stats for comparison
      const lastMonthStats = await Teacher.aggregate([
        {
          $match: {
            createdAt: { $lt: lastMonth }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        },
        {
          $group: {
            _id: null,
            totalTeachers: { $sum: 1 },
            activeTeachers: {
              $sum: { $cond: [{ $eq: ["$userInfo.status", "active"] }, 1, 0] }
            }
          }
        }
      ]);

      // Get last year stats for comparison
      const lastYearStats = await Teacher.aggregate([
        {
          $match: {
            createdAt: { $lt: lastYear }
          }
        },
        {
          $group: {
            _id: null,
            avgExperience: { $avg: "$experience" },
            subjectsCovered: { $size: { $addToSet: "$subjects" } }
          }
        }
      ]);

      const current = currentStats[0] || {
        totalTeachers: 0,
        activeTeachers: 0,
        avgExperience: 0,
        subjectsCovered: 0
      };
      const lastMonthData = lastMonthStats[0] || {
        totalTeachers: 0,
        activeTeachers: 0
      };
      const lastYearData = lastYearStats[0] || {
        avgExperience: 0,
        subjectsCovered: 0
      };

      // Calculate change percentages
      const totalTeachersChange = lastMonthData.totalTeachers ? 
        ((current.totalTeachers - lastMonthData.totalTeachers) / lastMonthData.totalTeachers * 100).toFixed(1) : 0;
      const activeTeachersChange = lastMonthData.activeTeachers ? 
        ((current.activeTeachers - lastMonthData.activeTeachers) / lastMonthData.activeTeachers * 100).toFixed(1) : 0;
      const experienceChange = lastYearData.avgExperience ? 
        (current.avgExperience - lastYearData.avgExperience).toFixed(1) : 0;
      const subjectsChange = lastYearData.subjectsCovered ? 
        current.subjectsCovered - lastYearData.subjectsCovered : 0;

      return responseHelper
        .status(200)
        .body({
          stats: {
            totalTeachers: {
              current: current.totalTeachers,
              changePercentage: parseFloat(totalTeachersChange),
              period: "month"
            },
            activeTeachers: {
              current: current.activeTeachers,
              changePercentage: parseFloat(activeTeachersChange),
              period: "month"
            },
            averageExperience: {
              current: current.avgExperience,
              change: parseFloat(experienceChange),
              period: "year"
            },
            subjectsCovered: {
              current: current.subjectsCovered,
              change: subjectsChange,
              period: "year"
            }
          }
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Get teacher by ID
router.get(
  "/read-one/:id",
  idValidatorMiddleware(),
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Teachers,
  }),
  async (req, res) => {
    const responseHelper = new ResponseHelper(res);
    try {
      const teacherUser = await User.findById(req.params.id).lean();
      if (!teacherUser) {
        return responseHelper
          .error({ ...ErrorMap.NOT_FOUND, message: "Teacher not found!" })
          .send();
      }

      const teacher = await Teacher.findOne({ user: req.params.id })
        .populate("subjects")
        .lean();

      if (!teacher) {
        return responseHelper
          .error({ ...ErrorMap.NOT_FOUND, message: "Teacher not found!" })
          .send();
      }

      return responseHelper
        .status(200)
        .body({
          ...teacher,
          ...teacherUser,
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Update teacher
router.put(
  "/update-one/:id",
  validatorMiddleware({
    params: {
      id: [validator.required(), validator.string()],
    },
    body: {
      name: [
        validator.string(),
        validator.minLength(2),
        validator.maxLength(50),
      ],
      email: [validator.email()],
      employeeId: [validator.string()],
      subjects: [validator.array()],
      qualification: [validator.string()],
      experience: [validator.number(), validator.min(0)],
      phone: [validator.string()],
      address: [validator.string(), validator.minLength(10)],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const updates = requestHelper.body();
      const teacherUserId = requestHelper.params("id");

      // Find teacher and associated user
      const teacherUser = await User.findById(teacherUserId);
      if (!teacherUser) {
        return responseHelper
          .status(404)
          .error(ErrorMap.TEACHER_NOT_FOUND)
          .send();
      }

      const teacher = await Teacher.findOne({ user: teacherUserId });
      if (!teacher) {
        return responseHelper
          .status(404)
          .error(ErrorMap.TEACHER_NOT_FOUND)
          .send();
      }

      // Prepare documents for parallel update
      const documents = [
        {
          model: Teacher,
          id: teacher._id,
          originalData: teacher,
          data: {
            employeeId: updates.employeeId,
            subjects: updates.subjects,
            qualification: updates.qualification,
            experience: updates.experience,
            user: teacher.user,
          },
        },
        {
          model: User,
          id: teacher.user,
          originalData: teacherUser,
          data: {
            name: updates.name,
            email: updates.email,
            phone: updates.phone,
            address: updates.address,
          },
        },
      ];

      // Update both documents in parallel within a transaction
      const [updatedTeacher, updatedUser] =
        await MongoDBHelper.updateParallelDocuments(documents);

      return responseHelper
        .status(200)
        .body({
          teacher: {
            ...updatedTeacher.toObject(),
            ...updatedUser.toObject(),
          },
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Delete teacher
router.delete("/delete-one/:id", async (req, res) => {
  const responseHelper = new ResponseHelper(res);
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return responseHelper.status(404).error(ErrorMap.NOT_FOUND).send();
    }
    return responseHelper
      .status(200)
      .body({ message: "Teacher deleted successfully" })
      .send();
  } catch (error) {
    responseHelper.error(error).send();
  }
});

module.exports = router;
