const express = require("express");
const router = express.Router();

const { AuthHelper } = require("../helpers");

const authHelper = new AuthHelper();

// Mount routes
// router.use(
//   "/account-settings",
//   authHelper.authenticate(),
//   accountSettingsRoutes
// );
router.use(
  "/attendence",
  authHelper.authenticate(),
  require("../features/attendence/attendence.route")
);
router.use(
  "/classroom",
  authHelper.authenticate(),
  require("../features/classroom/classroom.route")
);
router.use(
  "/bank",
  // authHelper.authenticate(),
  require("../features/bank/bank.route")
);
router.use(
  "/dashboard",
  authHelper.authenticate(),
  require("../features/dashboard/dashboard.route")
);
router.use(
  "/department",
  authHelper.authenticate(),
  require("../features/department/department.route")
);
router.use(
  "/email-settings",
  authHelper.authenticate(),
  require("../features/settings/email/email.route")
);
router.use(
  "/fees",
  authHelper.authenticate(),
  require("../features/fees/fees.route")
);
router.use(
  "/material",
  authHelper.authenticate(),
  require("../features/material/material.route")
);

router.use(
  "/notification",
  authHelper.authenticate(),
  require("../features/notification/notification.route")
);

router.use(
  "/plan",
  authHelper.authenticate(),
  require("../features/plan/plan.route")
);
router.use(
  "/location",
  authHelper.authenticate(),
  require("../features/location/location.route")
);
router.use(
  "/role",
  authHelper.authenticate(),
  require("../features/role/role.route")
);
router.use(
  "/student",
  authHelper.authenticate(),
  require("../features/student/student.route")
);
router.use(
  "/subject",
  authHelper.authenticate(),
  require("../features/subject/subject.route")
);
router.use(
  "/teacher",
  authHelper.authenticate(),
  require("../features/teacher/teacher.route")
);
router.use(
  "/test",
  authHelper.authenticate(),
  require("../features/test/test.route")
);
router.use(
  "/user",
  authHelper.authenticate(),
  require("../features/user/user.route")
);

module.exports = router;
