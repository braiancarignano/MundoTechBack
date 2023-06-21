const mongoose = require("mongoose");
const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      index: true,
      unique: true,
    },
    purchase_datetime: String,
    amount: Number,
    purcharser: {
      type: String,
    },
    products: {
      type: Array,
    },
  },
  {
    versionKey: false,
  }
);

const modelTickets = mongoose.model(ticketCollection, ticketSchema);

module.exports = modelTickets;
