const Notification = require("../models/notifications");

const createNotification = async (req, res, next) => {
  try {
    const { recipient, type, body, product } = req.body;
    const newNotification = new Notification({
      recipient,
      type,
      body,
      sender: req.user._id,
      product,
    });
    const savedNotification = await newNotification.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const myNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      recipient: userId,
      seen: false,
    }).populate("sender", "username fullName photo").sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: 1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const markNotificationAsSeen = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    notifyRecipient(deletedNotification);

    res.status(200).json(deletedNotification);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  myNotifications,
  markNotificationAsSeen,
  deleteNotification,
};
