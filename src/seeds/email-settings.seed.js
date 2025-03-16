const { EmailSettings } = require("../models");

const emailSettingsSeeds = {
  Model: EmailSettings,
  data: [
    {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "system@edumanage.com",
      smtpPassword: "your_secure_password",
      fromEmail: "notifications@edumanage.com",
      fromName: "EduManage System",
      encryption: "tls"
    },
    {
      smtpHost: "smtp.office365.com",
      smtpPort: 587,
      smtpUsername: "admin@edumanage.com",
      smtpPassword: "your_secure_password",
      fromEmail: "admin@edumanage.com",
      fromName: "EduManage Admin",
      encryption: "tls"
    }
  ]
};

module.exports = emailSettingsSeeds;