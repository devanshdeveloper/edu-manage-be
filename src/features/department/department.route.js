const express = require("express");
const router = express.Router();
const { Department } = require("../../models");
const {
  ResponseHelper,
  RequestHelper,
  idValidatorMiddleware,
} = require("../../helpers");
const ErrorMap = require("../../constants/ErrorMap");

// Create one department
router.post("/create-one", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const department = await Department.create(requestHelper.body());
    return responseHelper.status(201).body({ department }).send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Paginate departments
router.get("/paginate", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const data = await Department.paginate(
      {},
      requestHelper.getPaginationParams()
    );
    return responseHelper
      .body({ departments: data.data })
      .paginate(data.meta)
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Read one department
router.get("/read-one/:id", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const department = await Department.findById(requestHelper.params("id"));
    if (!department) {
      return responseHelper.error(ErrorMap.NOT_FOUND).send();
    }
    return responseHelper.body({ department }).send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Update one department
router.put("/update-one/:id", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const department = await Department.findByIdAndUpdate(
      requestHelper.params("id"),
      { $set: requestHelper.body() },
      { new: true, runValidators: true }
    );
    if (!department) {
      return responseHelper.error(ErrorMap.NOT_FOUND).send();
    }
    return responseHelper.body({ department }).send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Delete one department
router.delete("/delete-one/:id", idValidatorMiddleware(), async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);
  try {
    const department = await Department.findByIdAndDelete(
      requestHelper.params("id")
    );
    if (!department) {
      return responseHelper.error(ErrorMap.NOT_FOUND).send();
    }
    return responseHelper.body({ department }).send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

module.exports = router;
