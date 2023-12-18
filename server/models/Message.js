const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  chatRoom: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Message = model("Message", messageSchema);

module.exports = Message;
