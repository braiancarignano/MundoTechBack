const passport = require("passport");
const local = require("passport-local");
const GithubStrategy = require("passport-github2");
const { isValidPassword, createHash } = require("./utils.js");
const Cart = require("../dao/classes/carts.dao.js");
const CartService = new Cart();
const User = require("../dao/classes/users.dao.js");
const UserService = new User();
const LocalStrategy = local.Strategy;
const jwt = require("passport-jwt");
const ExtractJwt = jwt.ExtractJwt;
const JWTStrategy = jwt.Strategy;
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SESSION_SECRET,
} = require("./config.js");

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserService.searchUser(username);
          const carts = await CartService.createCart();
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: carts,
          };
          const response = await UserService.createUser(newUser);
          return done(null, response);
        } catch (error) {
          req.logger.error(
            `${req.method} en ${
              req.url
            }- ${new Date().toLocaleTimeString()} - Error al registrar el usuario`
          );
          return done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
      },
      async (username, password, done) => {
        try {
          const user = await UserService.searchUser(username);
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //registro con github

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.searchUser(profile._json.email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name ? profile._json.name : "",
              last_name: "",
              age: 0,
              email: profile._json.email,
              password: "",
            };
            const response = await UserService.createUser(newUser);
            return done(null, response);
          } else {
            return done(null, user);
          }
        } catch (error) {
          req.logger.error(
            `${req.method} en ${
              req.url
            }- ${new Date().toLocaleTimeString()} - error al obtener usuario`
          );
          return done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SESSION_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          req.logger.error(
            `${req.method} en ${
              req.url
            }- ${new Date().toLocaleTimeString()} - Error al crear token`
          );
          return done(error);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["CookieToken"];
  }
  return token;
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.searchUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = initializePassport;
