const Cart = require("../dao/classes/carts.dao.js");
const { getMail } = require("./mailing.controller.js");

const CartService = new Cart();

const getCart = async (req, res) => {
  let result = await CartService.getCart();
  if (!result)
    return res
      .status(500)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};

const getCartById = async (req, res) => {
  let cid = req.params.cid;
  let result = await CartService.getCartById(cid);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};

const createCart = async (req, res) => {
  const cart = req.body;
  let result = await CartService.createCart(cart);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};

const updateCart = async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let quantity = req.body.quantity;
  let result = await CartService.updateCart(cid, pid, quantity);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};

const deleteProductsInCart = async (req, res) => {
  let cid = req.params.cid;
  let result = await CartService.deleteProductsInCart(cid);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};
const deleteProduct = async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let result = await CartService.deleteProduct(cid, pid);
  if (!result)
    return res
      .status(404)
      .send({ status: "error", message: "Something went wrong" });
  res.send({ status: "success", result });
};
const purchase = async (req, res) => {
  try {
    let { user, cartID, totalAmount, products } = req.body;
    let ticket = await CartService.purchase(
      user,
      cartID,
      totalAmount,
      products
    );
    await getMail(ticket);
    res.json({
      status: "success",
      message: "Compra finalizada con éxito",
      payload: ticket,
    });
  } catch (err) {
    req.logger.error(
      `${req.method} en ${req.url}- ${new Date().toLocaleTimeString()}`
    );
    res.status(500).send({ status: "error", message: "Something went wrong" });
  }
};

module.exports = {
  getCart,
  getCartById,
  createCart,
  updateCart,
  deleteProductsInCart,
  deleteProduct,
  purchase,
};
