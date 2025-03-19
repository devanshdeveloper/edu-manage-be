const express = require("express");
const router = express.Router();
const Models = require("../../models");
const {
  ResponseHelper,
  RequestHelper,
  validator,
  idValidatorMiddleware,
} = require("../../helpers");
const { ErrorMap, Operations, Modules, UserTypes } = require("../../constants");
const { permissionMiddleware } = require("../permission/permission.middleware");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const Subject = Models.Subject;

// Create a new subject
router.post("/create-one", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const subject = await Subject.create(requestHelper.body());
    return responseHelper.status(201).body({ subject }).send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Get paginated subjects
router.get(
  "/paginate",
  permissionMiddleware([
    {
      UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
      Operations: Operations.CRUD,
      Modules: Modules.Subjects,
    },
    {
      UserTypes: [UserTypes.Teacher, UserTypes.Student],
      Operations: Operations.READ,
      Modules: Modules.Subjects,
    },
  ]),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
  }
);

// Get subject by ID
router.get(
  "/read-one/:id",
  validatorMiddleware({
    params: {
      id: [validator.string()],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const subject = await Subject.findById(requestHelper.params("id"));

      if (!subject) {
        return responseHelper
          .status(404)
          .error({ ...ErrorMap.NOT_FOUND, message: "Subject not found!" })
          .send();
      }
      return responseHelper.status(200).body({ subject }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Update subject
router.put(
  "/update-one/:id",
  validatorMiddleware({
    params: {
      id: [validator.string()],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const subject = await Subject.findByIdAndUpdate(
        requestHelper.params("id"),
        requestHelper.body()
      );

      if (!subject) {
        return responseHelper
          .status(404)
          .error({ ...ErrorMap.NOT_FOUND, message: "Subject not found" })
          .send();
      }
      return responseHelper.status(200).body({ subject }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Delete subject
router.delete("/delete-one/:id", idValidatorMiddleware(), async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const subject = await Subject.findByIdAndDelete(requestHelper.params("id"));
    if (!subject) {
      return responseHelper
        .status(404)
        .error({ ...ErrorMap.NOT_FOUND, message: "Subject not found" })
        .send();
    }
    return responseHelper
      .status(200)
      .message("Subject deleted successfully")
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

module.exports = router;
