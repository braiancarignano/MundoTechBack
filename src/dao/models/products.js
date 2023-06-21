const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    thumbnail: String,
    code: { type: String, unique: true},
    stock: String,
    category: String
  },
  {
    versionKey: false,
  }
);
productSchema.plugin(mongoosePaginate);
const modelProducts = mongoose.model("products", productSchema);

module.exports = modelProducts 
