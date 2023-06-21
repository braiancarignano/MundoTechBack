const { generateProduct } = require("../config/utils.js");
const Product = require("../dao/classes/products.dao.js");
const ProductService = new Product();

const mockingProducts = async (req, res) => {
  try {
    for (let i = 0; i < 5; i++) {
      const result = generateProduct();
      await ProductService.createProduct(result);
      console.log(result);
    }
    res.send({ status: "success" });
  } catch (err) {
    res.status(500).send("error");
  }
};
module.exports = { mockingProducts };
