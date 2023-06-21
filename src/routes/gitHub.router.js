const express = require("express");
const gitHubRouter = express.Router();
const passport = require("passport");

gitHubRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

gitHubRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("http://localhost:5173/");
  }
);

module.exports.gitHubRouter = gitHubRouter;
