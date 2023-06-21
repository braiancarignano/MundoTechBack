const express = require("express");
const passport = require("passport");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { passportCall, authorization } = require("../config/utils");
const User = require("../dao/classes/users.dao");
const UserService = new User();
const { SESSION_SECRET } = require("../config/config");

userRouter.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      req.logger.error(
        `${req.method} en ${
          req.url
        }- ${new Date().toLocaleTimeString()} - Error al crear el usuario`
      );
      return next(err);
    } else if (!user) {
      const error = new Error(info.message || "Error al crear el usuario");
      error.statusCode = 400;
      req.logger.error(
        `${req.method} en ${
          req.url
        }- ${new Date().toLocaleTimeString()} - Error al crear el usuario`
      );
      return next(error);
    } else {
      req.logger.info(
        `${req.method} en ${
          req.url
        }- ${new Date().toLocaleTimeString()} - Registro exitoso`
      );
      res.send({
        status: "success",
        message: "Usuario creado correctamente",
      });
    }
  })(req, res, next);
});

userRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      req.logger.error(
        `${req.method} en ${
          req.url
        }- ${new Date().toLocaleTimeString()} - Error al loggear el usuario`
      );
      return next(err);
    }
    if (!user) {
      req.logger.error(
        `${req.method} en ${req.url}- ${new Date().toLocaleTimeString()} - ${
          info.message
        }`
      );
      return res.redirect("/faillogin");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.logger.error(
          `${req.method} en ${
            req.url
          }- ${new Date().toLocaleTimeString()} - Error al loggear el usuario`
        );
        return next(err);
      }
      const username = req.user.email;
      const cart = req.user.cart;
      const firtsname = req.user.first_name;
      const lastname = req.user.last_name;
      const rol = req.user.rol;
      const id = req.user._id;
      const myToken = jwt.sign(
        { username, cart, firtsname, lastname, rol, id },
        SESSION_SECRET,
        {
          expiresIn: "24h",
        }
      );
      res
        .cookie("CookieToken", myToken, {
          maxAge: 60 * 60 * 1000,
        })
        .send({ message: "Loggeg in!" });
      req.logger.info(
        `${req.method} en ${
          req.url
        }- ${new Date().toLocaleTimeString()} - Inicio de sesion exitosamente`
      );
    });
  })(req, res, next);
});

userRouter.get(
  "/current",
  passportCall("jwt"),
  authorization("Consumer", "admin", "Premium"),
  (req, res) => {
    const decoded = jwt.verify(req.cookies.CookieToken, SESSION_SECRET);
    res.send(decoded);
  }
);
userRouter.get("/premium/:id", async (req, res) => {
  const user = await UserService.PremiumUser(req.params.id);
  if (user.message === "El usuario admin no puede ser Premium")
    return res.send(user.message);
  if (user.message === "El usuario ya es Premium")
    return res.send(user.message);
  res.send("Usuario premium creado con exito");
});

userRouter.get("/faillogin", async (req, res) => {});

module.exports.userRouter = userRouter;
