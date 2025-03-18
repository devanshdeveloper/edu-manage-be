const express = require("express");
const router = express.Router();
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const {
  ResponseHelper,
  RequestHelper,
  validator,
  ExpressHelper,
} = require("../../helpers");
const ContactUs = require("./contact-us.model");

// Rate limiting middleware to prevent spam
const contactLimiter = ExpressHelper.rateLimitMiddleware();

// Submit contact form
router.post(
  "/submit",
  contactLimiter,
  validatorMiddleware({
    body: {
      fullName: [
        validator.required(),
        validator.string(),
        validator.minLength(2),
        validator.maxLength(100),
      ],
      email: [validator.required(), validator.string(), validator.email()],
      phone: [
        validator.required(),
        validator.string(),
        validator.minLength(10),
        validator.maxLength(15),
      ],
      institutionName: [
        validator.required(),
        validator.string(),
        validator.minLength(2),
        validator.maxLength(100),
      ],
      numberOfStudents: [
        validator.required(),
        validator.number(),
        validator.min(1),
      ],
      message: [
        validator.required(),
        validator.string(),
        validator.minLength(10),
        validator.maxLength(1000),
      ],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);

    try {
      const contactData = requestHelper.body();
      const contact = await ContactUs.create(contactData);

      // TODO: Send email notification to admin
      // const emailHelper = new EmailHelper();
      // await emailHelper.sendContactNotification(contact);

      return responseHelper
        .status(201)
        .body({
          message: "Contact form submitted successfully",
          contact,
        })
        .send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

// Get paginated contact submissions (protected admin route)
router.get("/paginate", async (req, res) => {
  const requestHelper = new RequestHelper(req);
  const responseHelper = new ResponseHelper(res);

  try {
    const data = await ContactUs.paginate(
      { sort: { createdAt: -1 } },
      requestHelper.getPaginationParams()
    );

    return responseHelper
      .body({ contacts: data.data })
      .paginate(data.meta)
      .send();
  } catch (error) {
    return responseHelper.error(error).send();
  }
});

// Update contact status (protected admin route)
router.patch(
  "/:id/status",
  validatorMiddleware({
    body: {
      status: [
        validator.required(),
        validator.string(),
        validator.enum(["pending", "contacted", "resolved"]),
      ],
    },
  }),
  async (req, res) => {
    const requestHelper = new RequestHelper(req);
    const responseHelper = new ResponseHelper(res);

    try {
      const contact = await ContactUs.findByIdAndUpdate(
        req.params.id,
        { status: requestHelper.body().status },
        { new: true }
      );

      if (!contact) {
        return responseHelper
          .status(404)
          .error({ message: "Contact not found" })
          .send();
      }

      return responseHelper
        .body({
          message: "Contact status updated successfully",
          contact,
        })
        .send();
    } catch (error) {
      return responseHelper.error(error).send();
    }
  }
);

module.exports = router;
