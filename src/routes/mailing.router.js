const express = require("express");
const mailingRouter = express.Router();
const { getMail } = require("../controllers/mailing.controller.js");

mailingRouter.get("/", getMail);

module.exports.mailingRouter = mailingRouter;
