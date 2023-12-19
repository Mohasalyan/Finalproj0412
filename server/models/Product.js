const { Schema, model } = require("mongoose");
const matchRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["used", "new"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  option: {
    type: String,
    enum: ["sale", "swap", "both"],
    required: true,
  },
  color: {type:String},
  matchRequests: [matchRequestSchema],
  tips: {type:String},
});

const Product = model("Product", productSchema);

module.exports = Product;
