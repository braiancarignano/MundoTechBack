const express = require("express");
const cartRouter = express.Router();
const {
  getCart,
  getCartById,
  createCart,
  updateCart,
  deleteProductsInCart,
  deleteProduct,
  purchase,
} = require("../controllers/carts.controller.js");

cartRouter.get("/", getCart);
cartRouter.get("/:cid", getCartById);
cartRouter.post("/", createCart);
cartRouter.post("/purchase", purchase);
cartRouter.put("/:cid/product/:pid", updateCart);
cartRouter.delete("/delete/:cid/product/:pid", deleteProduct);
cartRouter.delete("/delete/:cid", deleteProductsInCart);

module.exports.cartRouter = cartRouter;
