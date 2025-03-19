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
const Student = Models.Student;
const User = Models.User;
const authHelper = new AuthHelper();

// Create a new student
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
      enrollmentId: [validator.required(), validator.string()],
      grade: [validator.required(), validator.string()],
      section: [validator.required(), validator.string()],
      phone: [validator.required(), validator.string()],
      address: [
        validator.required(),
        validator.string(),
        validator.minLength(10),
      ],
      parentName: [validator.required(), validator.string()],
      parentPhone: [validator.required(), validator.string()],
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

      const studentData = requestHelper.body();

      const hashedPassword = await authHelper.hashPassword(
        studentData.password
      );
      const userId = new mongoose.Types.ObjectId();

      // Prepare documents for parallel creation
      const documents = [
        {
          model: User,
          data: {
            ...studentData,
            _id: userId,
            password: hashedPassword,
            type: UserTypes.Student,
          },
        },
        {
          model: Student,
          data: {
            ...studentData,
            user: userId,
          },
        },
      ];

      // Create both documents in parallel within a transaction
      const [createdUser, createdStudent] =
        await MongoDBHelper.createParallelDocuments(documents);

      return responseHelper
        .status(201)
        .body({
          student: {
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            enrollmentId: createdStudent.enrollmentId,
            grade: createdStudent.grade,
            section: createdStudent.section,
            phone: createdUser.phone,
          },
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Get all students with pagination
router.get(
  "/paginate",
  permissionMiddleware(
    {
      UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
      Operations: Operations.CRUD,
      Modules: Modules.Students,
      Counter: (req) => {
        return Student.countDocuments({ user: req.user._id });
      },
    },
    {
      UserTypes: [UserTypes.User],
      Operations: Operations.READ,
      Modules: Modules.Students,
      Counter: (req) => {
        return Student.countDocuments({ user: req.user._id });
      },
    }
  ),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const students = await Student.find({});
      return responseHelper.status(200).body({ students }).send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Get student by ID
router.get("/read-one/:id", idValidatorMiddleware(), async (req, res) => {
  const responseHelper = new ResponseHelper(res);
  try {
    const studentUser = await User.findById(req.params.id).lean();
    if (!studentUser) {
      return responseHelper
        .error({ ...ErrorMap.NOT_FOUND, message: "Student not found" })
        .send();
    }

    const student = await Student.findOne({ user: req.params.id }).lean();
    if (!student) {
      return responseHelper
        .error({ ...ErrorMap.NOT_FOUND, message: "Student not found" })
        .send();
    }

    return responseHelper
      .status(200)
      .body({
        student: {
          ...student,
          ...studentUser,
        },
      })
      .send();
  } catch (error) {
    responseHelper.error(error).send();
  }
});

// Update student
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
      enrollmentId: [validator.string()],
      grade: [validator.string()],
      section: [validator.string()],
      phone: [validator.string()],
      address: [validator.string(), validator.minLength(10)],
      parentName: [validator.string()],
      parentPhone: [validator.string()],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const updates = requestHelper.body();
      const studentUserId = requestHelper.params("id");

      // Find student and associated user
      const studentUser = await User.findById(studentUserId);
      if (!studentUser) {
        return responseHelper
          .status(404)
          .error(ErrorMap.STUDENT_NOT_FOUND)
          .send();
      }

      const student = await Student.findOne({ user: studentUserId });
      if (!student) {
        return responseHelper
          .status(404)
          .error(ErrorMap.STUDENT_NOT_FOUND)
          .send();
      }

      // Prepare documents for parallel update
      const documents = [
        {
          model: Student,
          id: student._id,
          originalData: student,
          data: {
            enrollmentId: updates.enrollmentId,
            grade: updates.grade,
            section: updates.section,
            parentName: updates.parentName,
            parentPhone: updates.parentPhone,
            user: student.user,
          },
        },
        {
          model: User,
          id: student.user,
          originalData: studentUser,
          data: {
            name: updates.name,
            email: updates.email,
            phone: updates.phone,
            address: updates.address,
          },
        },
      ];

      // Update both documents in parallel within a transaction
      const [updatedStudent, updatedUser] =
        await MongoDBHelper.updateParallelDocuments(documents);

      return responseHelper
        .status(200)
        .body({
          student: {
            ...updatedStudent.toObject(),
            ...updatedUser.toObject(),
          },
        })
        .send();
    } catch (error) {
      responseHelper.error(error).send();
    }
  }
);

// Delete student
router.delete("/delete-one/:id", async (req, res) => {
  const responseHelper = new ResponseHelper(res);
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return responseHelper.status(404).error(ErrorMap.NOT_FOUND).send();
    }
    return responseHelper
      .status(200)
      .message("Student deleted successfully")
      .send();
  } catch (error) {
    responseHelper.error(error).send();
  }
});

module.exports = router;
