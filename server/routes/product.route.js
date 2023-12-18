const { Router } = require("express");
const productController = require("../controllers/product.controller");
const Authinticate = require("../middlewares/auhinticate.js");
const uploadFiles = require("../middlewares/uploadFile.js");

const productRouter = Router();
productRouter.use(uploadFiles);

productRouter.post("/", Authinticate(), productController.createProduct);

productRouter.get("/", productController.getProducts);
productRouter.get("/names", productController.getAllProductNames);
productRouter.get("/most-requested/:sellerId", productController.getMostRequestedProducts);

productRouter.get(
  "/my-products/match-requests",
  Authinticate(),
  productController.getMatchRequestsBySeller
);
productRouter.get(
  "/my-products",
  Authinticate(),
  productController.getMyProducts
);

productRouter.get(
  "/:id",
  Authinticate(false, true),
  productController.getProductById
);

productRouter.get(
  "/:id/match-request",
  Authinticate(),
  productController.sendMatchRequest
);

productRouter.patch(
  "/:productId/match-requests/:requestId",
  Authinticate(),
  productController.handleMatchRequest
);

productRouter.patch(
  "/:id",
  Authinticate(true),
  productController.updateProductById
);

productRouter.delete(
  "/:id",
  Authinticate(),
  productController.deleteProductById
);

productRouter.delete("/", Authinticate(), productController.deleteProducts);

module.exports = productRouter;
