require("dotenv").config();
const LINK_DB = process.env.LINK_DB;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const MAIL_SERVICE = process.env.MAIL_SERVICE;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const ENVIROMENT = "DE";
module.exports = {
  LINK_DB,
  COOKIE_SECRET,
  SESSION_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  MAIL_SERVICE,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  ENVIROMENT,
};
