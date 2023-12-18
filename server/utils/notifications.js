const mongoose = require("mongoose");
const createError = require("./createError");
const Notification = require("../models/Notifications");
const User = require("../models/User");

const sendNotificationToUser = async ({
  type,
  body,
  product,
  recipient,
  sender,
  matchRequest,
} = {}) => {
  try {
    const notification = new Notification({
      type,
      body,
      product,
      recipient,
      sender,
      matchRequest,
    });
    await notification.populate("sender","username fullName photo")
    await notification.save();
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  sendNotificationToUser,
};
