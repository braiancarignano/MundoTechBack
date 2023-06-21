const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const PORT = 8080;
const passport = require("passport");
const initializePassport = require("./config/passportConfig.js");
const { LINK_DB, COOKIE_SECRET } = require("./config/config.js");
const cors = require("cors");
const { Server } = require("socket.io");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const errorHandler = require("./middlewares/error.js");
const { productsRouter } = require("./routes/products.router.js");
const { cartRouter } = require("./routes/carts.router.js");
const { userRouter } = require("./routes/user.router.js");
const { gitHubRouter } = require("./routes/gitHub.router.js");
const { mockingRouter } = require("./routes/mockingProducts.router.js");
const { mailingRouter } = require("./routes/mailing.router.js");
const { loggerRouter } = require("./routes/logger.router.js");
const { addLogger } = require("./config/logger.js");
const httpServer = app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));
const socketServer = new Server(httpServer);
const path = require("path");
const dirname = __dirname;
const apiDocs = path.join(dirname, "../docs/**/*.yaml");

app.use(errorHandler);
app.use(addLogger);

app.use(cookieParser(COOKIE_SECRET));

//Configuración passport
initializePassport();
app.use(passport.initialize());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "bla bla bla",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", userRouter);
app.use("/api/sessions", gitHubRouter);
app.use("/api/mockingproducts", mockingRouter);
app.use("/api/mailing", mailingRouter);
app.use("/api/logger", loggerRouter);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  socket.on("mensaje", (data) => {
    console.log(data);
  });
  socket.emit("mesagge", "Este mensaje es enviado desde el servidor a todos");
  // socket.on("productoNuevo", async (data)=>{
  //     modelProducts.create(data)
  // })
  // socket.on("idEliminar", (data)=>{
  //     modelProducts.deleteOne(data)
  // })
  // let products = modelProducts.find().lean()
  // socket.emit("products", products)
});

//Swagger
const SwaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación ecommerce",
      description: "API de ecommerce",
    },
  },
  apis: [apiDocs],
};
const specs = swaggerJsdoc(SwaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const environment = async () => {
  try {
    await mongoose.connect(LINK_DB);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(error);
  }
};
environment();
