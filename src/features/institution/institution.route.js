const express = require("express");
const router = express.Router();
const { Institution } = require("../../models");
const { ResponseHelper, RequestHelper, validator } = require("../../helpers");
const { ErrorMap, Operations, Modules, UserTypes } = require("../../constants");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { permissionMiddleware } = require("../permission/permission.middleware");

// Create a new institution
router.post(
  "/create-one",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.CREATE,
    Modules: Modules.Institutions,
  }),
  validatorMiddleware({
    body: {
      name: [
        validator.required(),
        validator.string(),
        validator.minLength(2),
        validator.maxLength(100),
      ],
      address: [
        validator.required(),
        validator.string(),
        validator.minLength(10),
      ],
      phone: [validator.required(), validator.string()],
      email: [validator.required(), validator.string(), validator.email()],
      registrationNumber: [validator.required(), validator.string()],
      website: [validator.string()],
      foundedYear: [validator.number()],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const institutionData = requestHelper.body();

      // Check if institution with registration number already exists
      const existingInstitution = await Institution.findOne({
        registrationNumber: institutionData.registrationNumber,
      });
      if (existingInstitution) {
        return responseHelper
          .status(400)
          .error({
            ...ErrorMap.DUPLICATE_ENTRY,
            message: "Registration number already exists",
          })
          .send();
      }

      const institution = await Institution.create({
        ...institutionData,
        user: req.user._id,
      });

      return responseHelper.status(201).body({ institution }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Get institution by ID
router.get(
  "/read-one/:id",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Institutions,
  }),
  async (req, res) => {
    const responseHelper = new ResponseHelper(res);
    try {
      const institution = await Institution.findById(req.params.id);
      if (!institution) {
        return responseHelper
          .status(404)
          .error({ ...ErrorMap.NOT_FOUND, message: "Institution not found" })
          .send();
      }
      return responseHelper.status(200).body({ institution }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Get all institutions with pagination
router.get(
  "/paginate",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Institutions,
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const { sortField, sortOrder } = requestHelper.getSortParams();
      const searchFilter = requestHelper.getSearchParams(
        "name",
        "email",
        "phone",
        "registrationNumber"
      );

      const data = await Institution.paginate(
        { 
          sort: { [sortField]: sortOrder },
          filter: searchFilter
        },
        requestHelper.getPaginationParams()
      );

      return responseHelper
        .status(200)
        .body({ institutions: data.data })
        .paginate(data.meta)
        .send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Get institutions dropdown
router.get(
  "/dropdown",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.READ,
    Modules: Modules.Institutions,
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const data = await Institution.dropdown(
        { sort: { name: 1 }, select: "name" },
        requestHelper.getPaginationParams()
      );

      return responseHelper
        .status(200)
        .body({ institutions: data.data })
        .paginate(data.meta)
        .send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Update institution
router.put(
  "/update-one/:id",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.UPDATE,
    Modules: Modules.Institutions,
  }),
  validatorMiddleware({
    body: {
      name: [validator.string(), validator.minLength(2), validator.maxLength(100)],
      address: [validator.string(), validator.minLength(10)],
      phone: [validator.string()],
      email: [validator.string(), validator.email()],
      registrationNumber: [validator.string()],
      website: [validator.string()],
      foundedYear: [validator.number()],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);
    try {
      const updates = requestHelper.body();

      // Check if registration number is being updated and if it already exists
      if (updates.registrationNumber) {
        const existingInstitution = await Institution.findOne({
          registrationNumber: updates.registrationNumber,
          _id: { $ne: req.params.id },
        });
        if (existingInstitution) {
          return responseHelper
            .status(400)
            .error({
              ...ErrorMap.DUPLICATE_ENTRY,
              message: "Registration number already exists",
            })
            .send();
        }
      }

      const institution = await Institution.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      );

      if (!institution) {
        return responseHelper
          .status(404)
          .error({ ...ErrorMap.NOT_FOUND, message: "Institution not found" })
          .send();
      }

      return responseHelper.status(200).body({ institution }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Delete institution
router.delete(
  "/delete-one/:id",
  permissionMiddleware({
    UserTypes: [UserTypes.Admin, UserTypes.SuperAdmin],
    Operations: Operations.DELETE,
    Modules: Modules.Institutions,
  }),
  async (req, res) => {
    const responseHelper = new ResponseHelper(res);
    try {
      const institution = await Institution.findByIdAndDelete(req.params.id);
      if (!institution) {
        return responseHelper
          .status(404)
          .error({ ...ErrorMap.NOT_FOUND, message: "Institution not found" })
          .send();
      }
      return responseHelper.status(200).body({ institution }).send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

module.exports = router;