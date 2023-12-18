// Chat.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isNewMsg: Boolean,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
