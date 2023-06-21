const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passportConfig.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const cors = require("cors");
const path = require("path");
const dirname = __dirname;
const apiDocs = path.join(dirname, "../docs/**/*.yaml");
const app = express();
const port = 8080;
const { LINK_DB, COOKIE_SECRET } = require("./config/config.js");
const { addLogger } = require("./config/logger.js");
const errorHandler = require("./middlewares/error.js");
const { productsRouter } = require("./routes/products.router.js");
const { cartRouter } = require("./routes/carts.router.js");
const { userRouter } = require("./routes/user.router.js");
const { gitHubRouter } = require("./routes/gitHub.router.js");
const { mockingRouter } = require("./routes/mockingProducts.router.js");
const { mailingRouter } = require("./routes/mailing.router.js");
const { loggerRouter } = require("./routes/logger.router.js");

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
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(errorHandler);
app.use(addLogger);
app.use(cookieParser(COOKIE_SECRET));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", userRouter);
app.use("/api/sessions", gitHubRouter);
app.use("/api/mockingproducts", mockingRouter);
app.use("/api/mailing", mailingRouter);
app.use("/api/logger", loggerRouter);

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

app.listen(port, () => console.log(`Listening on ${port}`));

const environment = async () => {
  try {
    await mongoose.connect(LINK_DB);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(error);
  }
};
environment();
