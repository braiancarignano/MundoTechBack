const express = require("express");
const mockingRouter = express.Router();
const {
  mockingProducts,
} = require("../controllers/mockingProducts.controller.js");

mockingRouter.get("/", mockingProducts);

module.exports.mockingRouter = mockingRouter;
