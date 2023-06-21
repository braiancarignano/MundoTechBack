const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
    rol: { type: String, default: "Consumer" },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
  },
  {
    versionKey: false,
  }
);
const modelUser = mongoose.model("users", userSchema);

module.exports = modelUser;
