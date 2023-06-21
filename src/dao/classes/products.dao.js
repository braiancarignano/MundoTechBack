const modelProducts = require("../models/products.js");

class Product {
  getProduct = async (stock, page, limit, sort, url, category) => {
    try {
      let query;
      let prevURL;
      let nextURL;
      if (category != undefined || stock != undefined) {
        if (category != undefined) {
          query = { category: category };
        } else {
          query = { stock: stock };
        }
      } else {
        if (category != undefined && stock != undefined) {
          query = { category: category, stock: stock };
        } else {
          query = {};
        }
      }
      let data = await modelProducts.paginate(
        query,
        {
          page: page || 1,
          limit: limit,
          sort: { price: sort },
        },
        (err, res) => {
          res.hasPrevPage
            ? (prevURL = url.replace(
                `page=${res.page}`,
                `page=${res.prevPage}`
              ))
            : null;
          res.hasNextPage
            ? (nextURL =
                page == undefined
                  ? url.concat(`&page=${res.nextPage}`)
                  : url.replace(`page=${res.page}`, `page=${res.nextPage}`))
            : null;
          return {
            status: res.docs.length != 0 ? "success" : "error",
            payload: res.docs,
            totalPages: res.totalPages,
            prevPage: res.prevPage,
            nextPage: res.nextPage,
            page: res.page,
            hasPrevPage: res.hasPrevPage,
            hasNextPage: res.hasNextPage,
            prevLink: prevURL,
            nextLink: nextURL,
          };
        }
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  getProductById = async (id) => {
    try {
      const data = await modelProducts.findById(id);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  createProduct = async (product) => {
    try {
      const data = await modelProducts.create(product);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  updateProduct = async (id, product) => {
    try {
      const data = await modelProducts.findByIdAndUpdate({ _id: id }, product);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteProduct = async (id) => {
    try {
      const data = await modelProducts.findByIdAndDelete(id);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
module.exports = Product;
