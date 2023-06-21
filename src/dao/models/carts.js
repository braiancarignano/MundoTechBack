const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema(
  {
    products: [
      {
        IdProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        title: String,
        price: String,
        quantity: String,
        _id: false,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const modelCart = mongoose.model("carts", cartsSchema);

module.exports = modelCart;
