const winston = require("winston");
const config = require("./config.js");
const ENVIROMENT = config.ENVIROMENT;
let logger;

const customLevelOptions = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

// Condicional para determinar la customización según el entorno
// El entorno se determina por cli: "dev" / "prod". Default: desarrollo.

if (ENVIROMENT === "DEV") {
  console.log("Modo desarrollador");
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  console.log("Modo producción");
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "logs/errors.log",
        level: "error",
      }),
    ],
  });
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
module.exports = { addLogger, customLevelOptions };
