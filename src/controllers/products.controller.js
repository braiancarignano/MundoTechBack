const Product = require("../dao/classes/products.dao.js");
const ProductService = new Product();
const { CustomError } = require("../services/errors/customErrors.js");
const EErrors = require("../services/errors/enum.js");
const {
  generateProductsErrorInfo,
  deleteProductsErrorInfo,
} = require("../services/errors/info.js");

const getProduct = async (req, res) => {
  const stock = req.query.stock;
  const page = req.query.page;
  const limit = req.query.limit || 10;
  const sort = req.query.sort || 1;
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  const category = req.query.category;
  let result = await ProductService.getProduct(
    stock,
    page,
    limit,
    sort,
    url,
    category
  );
  if (!result)
    return res
      .status(500)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};
const getProductById = async (req, res) => {
  let pid = req.params.pid;
  let result = await ProductService.getProductById(pid);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};
const createProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, thumbnail, stock, category } =
      req.body;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !thumbnail ||
      !stock ||
      !category
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductsErrorInfo({
          title,
          description,
          code,
          price,
          thumbnail,
          stock,
          category,
        }),
        message: "Error trying to create Product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const product = {
      title,
      description,
      code,
      price,
      thumbnail,
      stock,
      category,
    };
    let response = await ProductService.createProduct(product);
    req.logger.info(
      `${req.method} en ${
        req.url
      }- ${new Date().toLocaleTimeString()} - Producto creado exitosamente`
    );
    res.status(200).send({ message: "Producto creado", response });
  } catch (error) {
    req.logger.error(
      `${req.method} en ${
        req.url
      }- ${new Date().toLocaleTimeString()} - Error al crear el producto`
    );
    next(error);
  }
};

const updateProduct = async (req, res) => {
  let id = req.params.pid;
  const product = await req.body;
  let result = await ProductService.updateProduct(id, product);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};

const deleteProduct = async (req, res, next) => {
  try {
    let id = req.params.pid;
    let result = await ProductService.deleteProduct(id);
    if (result === null || result === undefined) {
      CustomError.createError({
        name: "Product deletion error",
        cause: deleteProductsErrorInfo({
          id,
        }),
        message: "Error trying to delete Product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    req.logger.info(
      `${req.method} en ${
        req.url
      }- ${new Date().toLocaleTimeString()} - Producto eliminado exitosamente`
    );
  } catch (error) {
    req.logger.error(
      `${req.method} en ${
        req.url
      }- ${new Date().toLocaleTimeString()} - Error al eliminar el producto`
    );
    next(error);
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
