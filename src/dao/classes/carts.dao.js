const modelCart = require("../models/carts.js");
const modelProducts = require("../models/products.js");
const modelTickets = require("../models/tickets.js");
const crypto = require("crypto");

class Cart {
  getCart = async () => {
    try {
      const data = await modelCart.find();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  getCartById = async (id) => {
    try {
      const data = await modelCart.findById(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  createCart = async (cart) => {
    try {
      const data = await modelCart.create(cart);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  updateCart = async (cartId, productId, quantity) => {
    try {
      const cartSelect = await modelCart.findOne({ _id: cartId });
      const productSelect = await modelProducts.findOne({ _id: productId });
      const idProductDB = productSelect._id;
      let newProductInCart = {
        IdProducto: idProductDB,
        quantity: quantity,
      };

      const searchProductInCart = cartSelect.products.find(
        (e) => e.IdProducto.toString() === idProductDB.toString()
      );

      if (searchProductInCart) {
        cartSelect.products.map((e) => {
          if (e.IdProducto.toString() === idProductDB.toString()) {
            let num = parseInt(e.quantity, 10);
            let total = (num += parseInt(quantity));
            e.quantity = total;
          }
        });

        await modelCart.updateOne({ _id: cartId }, cartSelect);
      } else {
        cartSelect.products.push({
          title: productSelect.title,
          price: productSelect.price,
          ...newProductInCart,
        });
        await modelCart.updateOne({ _id: cartId }, cartSelect);
      }
      return cartSelect;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteProduct = async (id, product) => {
    try {
      const cartSelect = await modelCart.findOne({ _id: id });
      // const productSelect = await modelProducts.findOne({ _id: product });
      const productsNotDelete = cartSelect.products.filter(
        (e) => e.IdProducto.toString() !== product.toString()
      );
      cartSelect.products = productsNotDelete;
      await modelCart.updateOne({ _id: id }, cartSelect);
      return cartSelect;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteProductsInCart = async (id) => {
    try {
      const cartSelect = await modelCart.findOne({ _id: id });
      cartSelect.products = [];
      await modelCart.updateOne({ _id: id }, cartSelect);
      return cartSelect;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  purchase = async (user, cartID, totalAmount, products) => {
    try {
      let date = new Date();
      let ticketInfo = {
        code: crypto.randomUUID(),
        purchase_datetime: date.toLocaleString(),
        amount: totalAmount,
        purcharser: user,
        products: products,
      };
      const data = await modelTickets.create(ticketInfo);
      await this.deleteProductsInCart(cartID);
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
module.exports = Cart;
