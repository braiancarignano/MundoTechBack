// const express = require("express");
// const viewsRouter = express.Router();
// const modelProducts = require("../dao/models/products.js");

// const auth = async (req, res, next) => {
//   if (await req.session?.user) {
//     return next();
//   } else {
//     return res
//       .status(401)
//       .render("users/login", { script: "login", title: "Inicio Sesion" });
//   }
// };

// const adminAuth = async (req, res, next) => {
//   if (await req.session?.user) {
//     if (req.session.user.rol === "admin") {
//       return next();
//     }
//   }
//   return res
//     .status(401)
//     .render("users/login", { script: "login", title: "Inicio Sesion" });
// };

// viewsRouter.get("/", auth, async (req, res) => {
//   const userInfo = await req.session.user;
//   res.render("index", { script: "index", title: "Inicio", userInfo });
// });

// viewsRouter.get("/products", auth, async (req, res) => {
//   res.render("products/products", { script: "products", title: "Productos" });
// });

// viewsRouter.get("/administrador", adminAuth, async (req, res) => {
//   res.render("products/adminProducts", {
//     script: "products",
//     title: "Administrador",
//   });
// });

// viewsRouter.get("/login", async (req, res) => {
//   res.render("users/login", {
//     script: "login",
//     title: "Inicio Sesion",
//     img: "github.png",
//   });
// });

// viewsRouter.get("/register", async (req, res) => {
//   res.render("users/register", { script: "register", title: "Registro" });
// });

// module.exports.viewsRouter = viewsRouter;
