const modelUser = require("../models/users.js");

class User {
  searchUser = async (username) => {
    try {
      const user = await modelUser.findOne({ email: username });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  searchUserById = async (id) => {
    try {
      const user = await modelUser.findById(id);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  createUser = async (newUser) => {
    try {
      const user = await modelUser.create(newUser);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  PremiumUser = async (id) => {
    try {
      const userExist = await modelUser.findById(id);
      if (userExist.rol === "Premium")
        return { message: "El usuario ya es Premium" };
      if (userExist.rol === "admin")
        return { message: "El usuario admin no puede ser Premium" };
      if (userExist) {
        const user = await modelUser.findByIdAndUpdate(id, { rol: "Premium" });
        return { message: "Usuario Premium", user };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

module.exports = User;
