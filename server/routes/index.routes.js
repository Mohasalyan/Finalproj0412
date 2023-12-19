const { Router } = require("express");
const userRouter = require("../routes/user.route.js");
const categoryRouter = require("./category.route.js");
const productRouter = require("./product.route.js");
const notificationRouter = require("./notifications.route.js");
const chatRouter = require("./chat.route.js");
const indexRouter = Router();

indexRouter.use("/users", userRouter);
indexRouter.use("/category", categoryRouter);
indexRouter.use("/products", productRouter);
indexRouter.use("/notifications", notificationRouter);
indexRouter.use("/chat", chatRouter);

module.exports = indexRouter;
