const ModelHelper = require("./helpers/ModelHelper");

const Models = {
  Address: new ModelHelper(require("./features/address/address.model")),
  Bank: new ModelHelper(require("./features/bank/bank.model")),
  Department: new ModelHelper(require("./features/department/department.model")),
  Email: new ModelHelper(require("./features/settings/email/email.model")),
  Fees: new ModelHelper(require("./features/fees/fees.model")),
  Institution: new ModelHelper(require("./features/institution/institution.model")),
  Material: new ModelHelper(require("./features/material/material.model")),
  Notification: new ModelHelper(require("./features/notification/notification.model")),
  Permission: new ModelHelper(require("./features/permission/permission.model")),
  Plan: new ModelHelper(require("./features/plan/plan.model")),
  Role: new ModelHelper(require("./features/role/role.model")),
  Student: new ModelHelper(require("./features/student/student.model")),
  Subject: new ModelHelper(require("./features/subject/subject.model")),
  Teacher: new ModelHelper(require("./features/teacher/Teacher.model")),
  Test: new ModelHelper(require("./features/test/test.model")),
  User: new (require("./features/user/UserHelper"))(),
};

module.exports = Models;
