const { Router } = require("express");
const categoryController = require("../controllers/category.controller.js");
const uploadFiles = require("../middlewares/uploadFile.js");
const Authinticate = require("../middlewares/auhinticate.js");

const categoryRouter = Router();
categoryRouter.use(uploadFiles);

categoryRouter.post("/", Authinticate(true), categoryController.createCategory);

categoryRouter.get("/", categoryController.getCategories);

categoryRouter.put(
  "/:id",
  Authinticate(true),
  categoryController.updateCategory
);

categoryRouter.delete(
  "/:id",
  Authinticate(true),
  categoryController.deleteCategory
);
// For testing
categoryRouter.delete(
  "/",
  Authinticate(true),
  categoryController.dropCategories
);

module.exports = categoryRouter;
