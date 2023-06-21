const bcrypt = require("bcrypt");
const faker = require("@faker-js/faker").faker;
const passport = require("passport");

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) return next(error);
      if (!user)
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString(),
        });
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });
    if (!roles.includes(req.user.rol))
      return res.status(403).send({ error: "No permissions" });
    next();
  };
};

faker.locale = "es";
const generateProduct = () => {
  return {
    title: faker.commerce.productMaterial(),
    description: faker.commerce.productName(),
    code: faker.datatype.uuid(),
    price: parseInt(faker.commerce.price(0, 1500)),
    thumbnail: faker.image.imageUrl(),
    stock: faker.datatype.number({ max: 1000 }),
    category: faker.commerce.productAdjective(),
    status: true,
  };
};

module.exports = {
  createHash,
  isValidPassword,
  generateProduct,
  passportCall,
  authorization,
};
