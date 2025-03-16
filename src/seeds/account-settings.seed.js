const mongoose = require('mongoose');
const { AccountSettings } = require("../models");

const accountSettingsSeeds = {
  Model: AccountSettings,
  data: [
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: true,
        sms: true
      },
      language: "en",
      theme: "light"
    },
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: true,
        sms: false
      },
      language: "es",
      theme: "dark"
    },
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: false,
        sms: true
      },
      language: "fr",
      theme: "light"
    },
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: true,
        sms: true
      },
      language: "de",
      theme: "dark"
    },
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: false,
        sms: false
      },
      language: "en",
      theme: "light"
    },
    {
      user: new mongoose.Types.ObjectId(),
      notifications: {
        email: true,
        sms: false
      },
      language: "en",
      theme: "dark"
    }
  ]
};

module.exports = accountSettingsSeeds;