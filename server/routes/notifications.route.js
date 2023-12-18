const { Router } = require("express");
const notificationController = require("../controllers/notifications.controller");
const Authenticate = require("../middlewares/auhinticate");

const notificationRouter = Router();

notificationRouter.post(
  "/",
  Authenticate(),
  notificationController.createNotification
);
notificationRouter.get(
  "/all",
  Authenticate(),
  notificationController.getNotifications
);

notificationRouter.get(
  "/",
  Authenticate(),
  notificationController.myNotifications
);

notificationRouter.put(
  "/:id/seen",
  Authenticate(),
  notificationController.markNotificationAsSeen
);

notificationRouter.delete(
  "/:id",
  Authenticate(),
  notificationController.deleteNotification
);

module.exports = notificationRouter;
