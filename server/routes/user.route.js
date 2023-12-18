const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const uploadFiles = require("../middlewares/uploadFile.js");
const Authinticate = require("../middlewares/auhinticate.js");

const userRouter = Router();
userRouter.use(uploadFiles);

userRouter.get("/profile", Authinticate(), userController.myProfile);
userRouter.get("/top-rated", userController.getTopRatedUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.patch("/:id", Authinticate(), userController.updateProfile);
userRouter.post(
  "/seller-rating",
  Authinticate(),
  userController.createSellerRating
);


module.exports = userRouter;
