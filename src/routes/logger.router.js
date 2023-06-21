const express = require("express");
const loggerRouter = express.Router();
const { logger } = require("../controllers/logger.controller.js");

loggerRouter.get("/", logger);
loggerRouter.get("/test", (req, res) => {
  req.logger.info("Se ha accedido a la ruta /");
  res.send("Hola mundo");
});

module.exports = { loggerRouter };
