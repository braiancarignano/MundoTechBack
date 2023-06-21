const express = require("express");
const productsRouter = express.Router();
const {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller.js");

productsRouter.get("/", getProduct);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", createProduct);
productsRouter.put("/update/:pid", updateProduct);
productsRouter.delete("/delete/:pid", deleteProduct);

module.exports.productsRouter = productsRouter;
